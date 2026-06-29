import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { decryptSecret } from "@/lib/security/encryption";
import { createAuditLog } from "@/lib/services/audit.service";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { getMockMercadoPagoMovements, getNormalizedMercadoPagoMovements } from "@/lib/services/mercadoPago.service";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `mp-sync:${ip}`, limit: 5, windowMs: 60_000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados intentos de sincronizacion." }, { status: 429 });
  }

  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error }, { status: 401 });
  }

  if (!hasDatabaseEnv()) {
    return NextResponse.json({ error: "DATABASE_URL no esta configurado." }, { status: 503 });
  }

  let accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const account = await prisma.mercadoPagoAccount.findUnique({ where: { userId: user.id } });

  if (!accessToken && account?.accessTokenEncrypted) {
    accessToken = decryptSecret(account.accessTokenEncrypted);
  }

  const syncMode = accessToken ? "real" : "mock";
  const movements = accessToken ? await getNormalizedMercadoPagoMovements(accessToken) : getMockMercadoPagoMovements();
  let imported = 0;
  let skipped = 0;
  const createdInvoiceIds: string[] = [];

  for (const movement of movements) {
    const existing = await prisma.transaction.findUnique({
      where: {
        userId_externalId: {
          userId: user.id,
          externalId: movement.externalId,
        },
      },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        externalId: movement.externalId,
        kind: movement.kind,
        name: movement.name,
        amount: movement.amount,
        category: movement.category,
        type: movement.type,
        source: movement.source,
        date: new Date(movement.date),
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        transactionId: transaction.id,
        invoiceNumber: buildInternalInvoiceNumber(),
        type: getInvoiceType(movement.kind),
        date: new Date(movement.date),
        amount: movement.amount,
        concept: movement.name,
        category: movement.category,
        source: movement.source,
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { invoiceId: invoice.id },
    });

    createdInvoiceIds.push(invoice.id);
    imported += 1;
  }

  await prisma.mercadoPagoAccount.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      accountEmail: user.email ?? null,
      lastSync: new Date(),
      syncStatus: syncMode === "mock" ? "mock_synced" : "ok",
    },
    update: {
      accountEmail: user.email ?? account?.accountEmail ?? null,
      lastSync: new Date(),
      syncStatus: syncMode === "mock" ? "mock_synced" : "ok",
    },
  });

  await createAuditLog({
    userId: user.id,
    action: syncMode === "mock" ? "MP_MOCK_SYNC" : "MP_REAL_SYNC",
    entity: "mercado_pago_account",
    metadata: { imported, skipped, invoiceCount: createdInvoiceIds.length },
  });

  return NextResponse.json({
    imported,
    skipped,
    mode: syncMode,
    status: "ok",
  });
}

import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { decryptSecret } from "@/lib/security/encryption";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { getNormalizedMercadoPagoMovements } from "@/lib/services/mercadoPago.service";

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

  if (!accessToken && account) {
    accessToken = decryptSecret(account.accessTokenEncrypted);
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Conecta Mercado Pago o configura MERCADO_PAGO_ACCESS_TOKEN en el backend." },
      { status: 409 },
    );
  }

  const movements = await getNormalizedMercadoPagoMovements(accessToken);
  let imported = 0;
  let skipped = 0;

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

    imported += 1;
  }

  if (account) {
    await prisma.mercadoPagoAccount.update({
      where: { userId: user.id },
      data: {
        lastSync: new Date(),
        syncStatus: "ok",
      },
    });
  }

  return NextResponse.json({
    imported,
    skipped,
    status: "ok",
  });
}

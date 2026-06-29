import { NextResponse } from "next/server";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { requireUser } from "@/lib/api/auth";
import { serializeTransaction } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { transactionSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: auth.user.id },
    include: { invoice: true },
    orderBy: { date: "desc" },
    take: 200,
  });

  return NextResponse.json({ items: transactions.map(serializeTransaction) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = transactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (data.externalId) {
    const existing = await prisma.transaction.findUnique({
      where: { userId_externalId: { userId: auth.user.id, externalId: data.externalId } },
    });

    if (existing) {
      return NextResponse.json({ error: "Ese movimiento importado ya existe." }, { status: 409 });
    }
  }

  const transaction = await prisma.$transaction(async (tx) => {
    const created = await tx.transaction.create({
      data: {
        userId: auth.user.id,
        externalId: data.externalId,
        kind: data.kind,
        name: data.name,
        amount: data.amount,
        category: data.category,
        type: data.type,
        source: data.source,
        date: new Date(data.date),
        note: data.note,
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        userId: auth.user.id,
        transactionId: created.id,
        invoiceNumber: buildInternalInvoiceNumber(),
        type: getInvoiceType(data.kind),
        date: new Date(data.date),
        amount: data.amount,
        concept: data.name,
        category: data.category,
        source: data.source,
      },
    });

    return tx.transaction.update({
      where: { id: created.id },
      data: { invoiceId: invoice.id },
      include: { invoice: true },
    });
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "TRANSACTION_CREATED",
    entity: "transaction",
    entityId: transaction.id,
    metadata: { kind: transaction.kind, source: transaction.source, category: transaction.category },
  });
  if (transaction.invoice) {
    await createAuditLog({
      userId: auth.user.id,
      action: "INVOICE_CREATED",
      entity: "invoice",
      entityId: transaction.invoice.id,
      metadata: { type: transaction.invoice.type, source: transaction.invoice.source },
    });
  }

  return NextResponse.json({ item: serializeTransaction(transaction) }, { status: 201 });
}

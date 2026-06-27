import { NextResponse } from "next/server";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { requireUser } from "@/lib/api/auth";
import { serializeTransaction } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { transactionImportSchema } from "@/lib/validations/finance.schema";

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = transactionImportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const imported = [];
  let skipped = 0;

  for (const item of parsed.data.transactions) {
    if (item.externalId) {
      const existing = await prisma.transaction.findUnique({
        where: { userId_externalId: { userId: auth.user.id, externalId: item.externalId } },
      });

      if (existing) {
        skipped += 1;
        continue;
      }
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.transaction.create({
        data: {
          userId: auth.user.id,
          externalId: item.externalId,
          kind: item.kind,
          name: item.name,
          amount: item.amount,
          category: item.category,
          type: item.type,
          source: item.source,
          date: new Date(item.date),
          note: item.note,
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          userId: auth.user.id,
          transactionId: created.id,
          invoiceNumber: buildInternalInvoiceNumber(),
          type: getInvoiceType(item.kind),
          date: new Date(item.date),
          amount: item.amount,
          concept: item.name,
          category: item.category,
          source: item.source,
        },
      });

      return tx.transaction.update({
        where: { id: created.id },
        data: { invoiceId: invoice.id },
        include: { invoice: true },
      });
    });

    imported.push(serializeTransaction(transaction));
  }

  return NextResponse.json({ imported: imported.length, skipped, items: imported });
}

import { NextResponse } from "next/server";
import { getInvoiceType } from "@/lib/domain/invoiceEngine";
import { requireUser } from "@/lib/api/auth";
import { serializeObligation } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { buildInternalInvoiceNumber } from "@/lib/services/invoice.service";
import { idSchema } from "@/lib/validations/finance.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_: Request, context: RouteContext) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const obligation = await prisma.obligation.findFirst({ where: { id, userId: auth.user.id } });

  if (!obligation) {
    return NextResponse.json({ error: "Obligacion no encontrada." }, { status: 404 });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        userId: auth.user.id,
        kind: "expense",
        name: obligation.name,
        amount: obligation.amount,
        category: obligation.category,
        type: obligation.frequency === "semanal" ? "semanal" : "mensual",
        source: "manual",
        date: new Date(),
        note: "Egreso generado al marcar obligacion como pagada.",
      },
    });

    const invoice = await tx.invoice.create({
      data: {
        userId: auth.user.id,
        transactionId: transaction.id,
        invoiceNumber: buildInternalInvoiceNumber(),
        type: getInvoiceType("expense"),
        date: new Date(),
        amount: obligation.amount,
        concept: obligation.name,
        category: obligation.category,
        source: "manual",
      },
    });

    await tx.transaction.update({ where: { id: transaction.id }, data: { invoiceId: invoice.id } });

    return tx.obligation.update({
      where: { id },
      data: { status: "pagado" },
    });
  });

  return NextResponse.json({ item: serializeObligation(updated) });
}

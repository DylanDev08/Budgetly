import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeTransaction } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { idSchema, transactionUpdateSchema } from "@/lib/validations/finance.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = transactionUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.transaction.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Movimiento no encontrado." }, { status: 404 });
  }

  const data = parsed.data;
  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
    include: { invoice: true },
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "TRANSACTION_UPDATED",
    entity: "transaction",
    entityId: transaction.id,
    metadata: { fields: Object.keys(parsed.data) },
  });

  return NextResponse.json({ item: serializeTransaction(transaction) });
}

export async function DELETE(_: Request, context: RouteContext) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const parsedId = idSchema.safeParse(id);

  if (!parsedId.success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const existing = await prisma.transaction.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Movimiento no encontrado." }, { status: 404 });
  }

  await prisma.transaction.delete({ where: { id } });

  await createAuditLog({
    userId: auth.user.id,
    action: "TRANSACTION_DELETED",
    entity: "transaction",
    entityId: id,
    metadata: { name: existing.name, kind: existing.kind },
  });

  return NextResponse.json({ ok: true });
}

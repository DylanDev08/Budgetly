import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeBudget } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { budgetUpdateSchema, idSchema } from "@/lib/validations/finance.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const existing = await prisma.budget.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Presupuesto no encontrado." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = budgetUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.budget.update({ where: { id }, data: parsed.data });

  return NextResponse.json({ item: serializeBudget(item) });
}

export async function DELETE(_: Request, context: RouteContext) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const existing = await prisma.budget.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Presupuesto no encontrado." }, { status: 404 });
  }

  await prisma.budget.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

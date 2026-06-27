import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeObligation } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { idSchema, obligationUpdateSchema } from "@/lib/validations/finance.schema";

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

  const existing = await prisma.obligation.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Obligacion no encontrada." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = obligationUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.obligation.update({ where: { id }, data: parsed.data });

  return NextResponse.json({ item: serializeObligation(item) });
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

  const existing = await prisma.obligation.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Obligacion no encontrada." }, { status: 404 });
  }

  await prisma.obligation.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

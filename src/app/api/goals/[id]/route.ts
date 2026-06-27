import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeGoal } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { goalUpdateSchema, idSchema } from "@/lib/validations/finance.schema";

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

  const existing = await prisma.goal.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Meta no encontrada." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = goalUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const item = await prisma.goal.update({
    where: { id },
    data: {
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : data.deadline,
    },
  });

  return NextResponse.json({ item: serializeGoal(item) });
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

  const existing = await prisma.goal.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Meta no encontrada." }, { status: 404 });
  }

  await prisma.goal.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

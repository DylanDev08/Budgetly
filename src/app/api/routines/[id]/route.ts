import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeRoutine } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { idSchema, routineUpdateSchema } from "@/lib/validations/finance.schema";

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

  const existing = await prisma.routine.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Rutina no encontrada." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = routineUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.routine.update({ where: { id }, data: parsed.data });

  return NextResponse.json({ item: serializeRoutine(item) });
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

  const existing = await prisma.routine.findFirst({ where: { id, userId: auth.user.id } });

  if (!existing) {
    return NextResponse.json({ error: "Rutina no encontrada." }, { status: 404 });
  }

  await prisma.routine.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

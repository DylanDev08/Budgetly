import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeRoutine } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { routineSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.routine.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: items.map(serializeRoutine) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = routineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.routine.create({
    data: {
      userId: auth.user.id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ item: serializeRoutine(item) }, { status: 201 });
}

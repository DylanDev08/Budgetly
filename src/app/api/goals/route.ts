import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeGoal } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { goalSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.goal.findMany({
    where: { userId: auth.user.id },
    orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ items: items.map(serializeGoal) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = goalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const item = await prisma.goal.create({
    data: {
      userId: auth.user.id,
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });

  return NextResponse.json({ item: serializeGoal(item) }, { status: 201 });
}

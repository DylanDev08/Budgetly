import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeBudget } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.budget.findMany({
    where: { userId: auth.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: items.map(serializeBudget) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = budgetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.budget.create({
    data: {
      userId: auth.user.id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ item: serializeBudget(item) }, { status: 201 });
}

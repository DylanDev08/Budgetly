import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeObligation } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { obligationSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.obligation.findMany({
    where: { userId: auth.user.id },
    orderBy: [{ status: "asc" }, { dueDay: "asc" }],
  });

  return NextResponse.json({ items: items.map(serializeObligation) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = obligationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.obligation.create({
    data: {
      userId: auth.user.id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ item: serializeObligation(item) }, { status: 201 });
}

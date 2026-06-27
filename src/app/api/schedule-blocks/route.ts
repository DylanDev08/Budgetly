import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeScheduleBlock } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { scheduleBlockSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.scheduleBlock.findMany({
    where: { userId: auth.user.id },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return NextResponse.json({ items: items.map(serializeScheduleBlock) });
}

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = scheduleBlockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.scheduleBlock.create({
    data: {
      userId: auth.user.id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ item: serializeScheduleBlock(item) }, { status: 201 });
}

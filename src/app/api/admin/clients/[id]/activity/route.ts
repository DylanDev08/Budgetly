import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const items = await prisma.clientActivity.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return NextResponse.json({
    success: true,
    data: { items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })) },
  });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { serializeBudget } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const budgets = await prisma.budget.findMany({ orderBy: { createdAt: "desc" }, take: 300 });

  return NextResponse.json({ success: true, data: { items: budgets.map(serializeBudget) } });
}

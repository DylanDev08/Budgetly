import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { serializeTransaction } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const transactions = await prisma.transaction.findMany({
    include: { invoice: true },
    orderBy: { date: "desc" },
    take: 300,
  });

  return NextResponse.json({ success: true, data: { items: transactions.map(serializeTransaction) } });
}

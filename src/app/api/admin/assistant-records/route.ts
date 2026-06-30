import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const [messages, extractions] = await Promise.all([
    prisma.assistantMessage.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.extractedFinancialData.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      messages: messages.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
      extractions: extractions.map((item) => ({
        ...item,
        amount: item.amount ? Number(item.amount.toString()) : null,
        confidence: Number(item.confidence.toString()),
        date: item.date?.toISOString().slice(0, 10) ?? null,
        createdAt: item.createdAt.toISOString(),
        confirmedAt: item.confirmedAt?.toISOString() ?? null,
      })),
    },
  });
}

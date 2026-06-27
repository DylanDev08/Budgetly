import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: auth.user.id },
    orderBy: { date: "desc" },
    take: 200,
  });

  return NextResponse.json({
    items: invoices.map((invoice) => ({
      ...invoice,
      amount: Number(invoice.amount.toString()),
      date: invoice.date.toISOString().slice(0, 10),
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
    })),
  });
}

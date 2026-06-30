import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { maskEmail, maskIdentifier } from "@/lib/utils/privacy";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.mercadoPagoAccount.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    select: {
      id: true,
      userId: true,
      mpUserId: true,
          accountEmail: true,
      lastSync: true,
      syncStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      items: items.map((item) => ({
        ...item,
        mpUserId: maskIdentifier(item.mpUserId),
        accountEmail: maskEmail(item.accountEmail),
        lastSync: item.lastSync?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    },
  });
}

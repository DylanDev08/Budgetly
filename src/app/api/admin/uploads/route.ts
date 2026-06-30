import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.uploadedAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({
    success: true,
    data: {
      items: items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    },
  });
}

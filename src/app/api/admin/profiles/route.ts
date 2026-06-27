import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { serializeProfile } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const profiles = await prisma.profile.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ items: profiles.map(serializeProfile) });
}

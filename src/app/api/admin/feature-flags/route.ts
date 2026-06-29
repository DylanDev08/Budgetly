import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { adminFeatureFlagSchema } from "@/lib/validations/admin.schema";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.featureFlag.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({
    success: true,
    data: { items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })) },
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = adminFeatureFlagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const flag = await prisma.featureFlag.create({ data: parsed.data });

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_FEATURE_FLAG_CREATED",
    entity: "feature_flag",
    entityId: flag.id,
    metadata: { key: flag.key },
  });

  return NextResponse.json({ success: true, data: { item: flag } }, { status: 201 });
}

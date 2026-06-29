import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { adminFeatureFlagUpdateSchema } from "@/lib/validations/admin.schema";
import { idSchema } from "@/lib/validations/finance.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ success: false, error: "Id invalido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminFeatureFlagUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const flag = await prisma.featureFlag.update({ where: { id }, data: parsed.data });

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_FEATURE_FLAG_UPDATED",
    entity: "feature_flag",
    entityId: flag.id,
    metadata: { fields: Object.keys(parsed.data) },
  });

  return NextResponse.json({ success: true, data: { item: flag } });
}

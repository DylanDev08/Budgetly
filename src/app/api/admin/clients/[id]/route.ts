import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/services/audit.service";
import { getAdminClientDetail } from "@/lib/services/adminClient.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const detail = await getAdminClientDetail(id);

  if (!detail) {
    return NextResponse.json({ success: false, error: "Cliente no encontrado." }, { status: 404 });
  }

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_CLIENT_VIEWED",
    entity: "profile",
    entityId: detail.profile.id,
    metadata: { targetUserId: id },
  });

  return NextResponse.json({ success: true, data: detail });
}

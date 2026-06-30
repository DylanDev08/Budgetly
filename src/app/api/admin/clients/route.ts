import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { listAdminClients } from "@/lib/services/adminClient.service";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const clients = await listAdminClients();

  return NextResponse.json({ success: true, data: { items: clients } });
}

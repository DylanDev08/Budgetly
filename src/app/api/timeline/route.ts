import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { getFinancialTimeline } from "@/lib/services/timeline.service";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const timeline = await getFinancialTimeline(auth.user.id);

  return NextResponse.json({ success: true, data: { items: timeline } });
}

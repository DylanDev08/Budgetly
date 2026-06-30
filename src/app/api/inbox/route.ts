import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { getSmartInbox } from "@/lib/services/inbox.service";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const inbox = await getSmartInbox(auth.user.id);

  return NextResponse.json({ success: true, data: inbox });
}

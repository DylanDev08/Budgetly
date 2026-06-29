import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";

export async function POST() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  return NextResponse.json({
    success: false,
    error: "Checkout real pendiente. Usa mock-activate en desarrollo.",
  }, { status: 501 });
}

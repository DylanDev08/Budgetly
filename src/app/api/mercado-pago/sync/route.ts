import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `mp-sync:${ip}`, limit: 5, windowMs: 60_000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados intentos de sincronizacion." }, { status: 429 });
  }

  return NextResponse.json({
    imported: 0,
    skipped: 0,
    status: "pending_real_oauth",
  });
}

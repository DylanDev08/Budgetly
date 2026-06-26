import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    const failUrl = new URL("/mercado-pago", getAppUrl());
    failUrl.searchParams.set("status", "missing_code");
    return NextResponse.redirect(failUrl);
  }

  const nextUrl = new URL("/mercado-pago", getAppUrl());
  nextUrl.searchParams.set("status", "oauth_pending");
  return NextResponse.redirect(nextUrl);
}

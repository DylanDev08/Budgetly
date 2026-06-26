import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";

export async function GET(request: Request) {
  const clientId = process.env.MERCADO_PAGO_CLIENT_ID;
  const redirectUri = process.env.MERCADO_PAGO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    const url = new URL("/mercado-pago", getAppUrl());
    url.searchParams.set("status", "missing_config");
    return NextResponse.redirect(url);
  }

  const from = new URL(request.url).searchParams.get("from") ?? "manual";
  const authUrl = new URL("https://auth.mercadopago.com.ar/authorization");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("platform_id", "mp");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("state", from);

  return NextResponse.redirect(authUrl);
}

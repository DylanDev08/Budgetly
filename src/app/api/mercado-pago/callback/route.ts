import { NextResponse } from "next/server";
import { getAppUrl, hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/security/encryption";
import { exchangeMercadoPagoCode } from "@/lib/services/mercadoPagoOAuth.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    const failUrl = new URL("/mercado-pago", getAppUrl());
    failUrl.searchParams.set("status", "missing_code");
    return NextResponse.redirect(failUrl);
  }

  const { user } = await getAuthenticatedUser();

  if (!user) {
    const loginUrl = new URL("/auth/login", getAppUrl());
    loginUrl.searchParams.set("next", "/mercado-pago");
    return NextResponse.redirect(loginUrl);
  }

  if (!hasDatabaseEnv()) {
    const failUrl = new URL("/mercado-pago", getAppUrl());
    failUrl.searchParams.set("status", "missing_database");
    return NextResponse.redirect(failUrl);
  }

  try {
    const token = await exchangeMercadoPagoCode(code);
    const expiresAt = new Date(Date.now() + (token.expires_in ?? 21600) * 1000);

    await prisma.mercadoPagoAccount.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        mpUserId: token.user_id ? String(token.user_id) : null,
        accountEmail: user.email ?? null,
        accessTokenEncrypted: encryptSecret(token.access_token),
        refreshTokenEncrypted: encryptSecret(token.refresh_token ?? ""),
        expiresAt,
        syncStatus: "connected",
      },
      update: {
        mpUserId: token.user_id ? String(token.user_id) : null,
        accountEmail: user.email ?? null,
        accessTokenEncrypted: encryptSecret(token.access_token),
        refreshTokenEncrypted: encryptSecret(token.refresh_token ?? ""),
        expiresAt,
        syncStatus: "connected",
      },
    });
  } catch {
    const failUrl = new URL("/mercado-pago", getAppUrl());
    failUrl.searchParams.set("status", "oauth_error");
    return NextResponse.redirect(failUrl);
  }

  const nextUrl = new URL("/mercado-pago", getAppUrl());
  nextUrl.searchParams.set("status", "connected");
  return NextResponse.redirect(nextUrl);
}

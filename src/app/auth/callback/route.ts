import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/env";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createAuditLog } from "@/lib/services/audit.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function getOAuthErrorCode(error: { message?: string; status?: number } | null) {
  const message = error?.message?.toLowerCase() ?? "";

  if (message.includes("code verifier") || message.includes("code_verifier")) {
    return "oauth_code_verifier";
  }

  if (message.includes("redirect") || message.includes("callback")) {
    return "oauth_redirect";
  }

  if (message.includes("provider") || message.includes("google")) {
    return "oauth_provider";
  }

  return "oauth_exchange_failed";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error");
  const providerErrorDescription = requestUrl.searchParams.get("error_description");

  if (providerError) {
    console.error("[auth/callback] OAuth provider error", {
      error: providerError,
      description: providerErrorDescription,
    });

    const loginUrl = new URL("/auth/login", getAppUrl());
    loginUrl.searchParams.set("error", "oauth_provider");
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    const loginUrl = new URL("/auth/login", getAppUrl());
    loginUrl.searchParams.set("error", "missing_oauth_code");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Supabase exchangeCodeForSession failed", {
      name: error.name,
      message: error.message,
      status: error.status,
    });

    const loginUrl = new URL("/auth/login", getAppUrl());
    loginUrl.searchParams.set("error", getOAuthErrorCode(error));
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await ensureProfile(user);

    await createAuditLog({
      userId: user.id,
      action: "LOGIN_VALIDATED",
      entity: "auth",
      entityId: profile.id,
      metadata: { provider: "google" },
    });

    const next = requestUrl.searchParams.get("next");
    const fallbackPath = profile.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(next ?? fallbackPath, getAppUrl()));
  }

  return NextResponse.redirect(new URL("/auth/login?error=oauth", getAppUrl()));
}

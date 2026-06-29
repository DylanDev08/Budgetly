import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { createAuditLog } from "@/lib/services/audit.service";
import { ensureUserProfile } from "@/lib/services/profile.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/features/auth/schemas";

function getSafeSignInError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Email o clave incorrectos, o la cuenta todavia no existe en Supabase Auth.";
  }

  if (normalized.includes("email not confirmed") || normalized.includes("not confirmed")) {
    return "Tenes que confirmar el email antes de iniciar sesion.";
  }

  if (normalized.includes("disabled")) {
    return "El login por email esta deshabilitado en Supabase Auth.";
  }

  if (normalized.includes("rate") || normalized.includes("too many")) {
    return "Demasiados intentos. Espera un momento y volve a probar.";
  }

  return "No se pudo iniciar sesion. Revisa credenciales y configuracion de Supabase Auth.";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `login:${ip}`, limit: 5, windowMs: 60_000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 503 });
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    console.warn("Supabase signIn failed", {
      status: error.status,
      code: error.code,
      message: error.message,
    });

    return NextResponse.json({ error: getSafeSignInError(error.message) }, { status: error.status ?? 401 });
  }

  if (data.user) {
    const profile = await ensureUserProfile({
      userId: data.user.id,
      fullName: data.user.user_metadata.full_name ?? data.user.email ?? "Usuario Budgetly",
      email: data.user.email ?? parsed.data.email,
    });

    await createAuditLog({
      userId: data.user.id,
      action: "LOGIN_VALIDATED",
      entity: "auth",
      entityId: profile.id,
      metadata: { provider: "password" },
    });
  }

  return NextResponse.json({ ok: true });
}

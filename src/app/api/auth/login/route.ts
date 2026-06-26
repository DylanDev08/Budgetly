import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema } from "@/features/auth/schemas";

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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return NextResponse.json({ error: "No se pudo iniciar sesion con esas credenciales." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}

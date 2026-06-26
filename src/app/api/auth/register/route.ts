import { NextResponse } from "next/server";
import { getAppUrl, hasSupabaseEnv } from "@/lib/env";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { registerSchema } from "@/features/auth/schemas";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `register:${ip}`, limit: 3, windowMs: 5 * 60_000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiados registros desde esta conexion. Intenta mas tarde." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Supabase no esta configurado." }, { status: 503 });
  }

  const { email, password, fullName, connectMercadoPago } = parsed.data;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getAppUrl()}/dashboard`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: "No se pudo crear la cuenta." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    redirectTo: connectMercadoPago ? "/api/mercado-pago/connect?from=register" : "/dashboard",
  });
}

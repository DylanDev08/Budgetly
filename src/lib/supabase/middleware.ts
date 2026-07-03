import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import type { Database } from "@/types/database";

const publicPrefixes = ["/auth", "/legal", "/api", "/_next"];
const publicPaths = ["/"];
const maxSessionAgeMs = 24 * 60 * 60 * 1000;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api")) {
    const ip = getClientIp(request);
    const limit = rateLimit({ key: `api:${ip}:${pathname}`, limit: 180, windowMs: 60_000 });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Espera un momento antes de continuar." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))),
          },
        },
      );
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublicPath = publicPaths.includes(pathname) || publicPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin");

  if (!user && isAdminRoute) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Sesion requerida." }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user?.last_sign_in_at && Date.now() - new Date(user.last_sign_in_at).getTime() > maxSessionAgeMs) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("reason", "session_expired");
    return NextResponse.redirect(url);
  }

  if (user && isAdminRoute) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    const profile = profileData as { role?: string } | null;

    if (profile?.role !== "admin") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Acceso admin requerido." }, { status: 403 });
      }

      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

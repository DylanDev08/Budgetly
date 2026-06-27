import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";

const fallbackAdminEmails = ["dylansalcedo333@gmail.com"];

export async function requireUser() {
  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return { user: null, response: NextResponse.json({ error }, { status: 401 }) };
  }

  if (!hasDatabaseEnv()) {
    return {
      user: null,
      response: NextResponse.json({ error: "DATABASE_URL no esta configurado." }, { status: 503 }),
    };
  }

  return { user, response: null };
}

export function isAdminEmail(email?: string | null) {
  if (!email) {
    return false;
  }

  const configuredEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const admins = configuredEmails.length > 0 ? configuredEmails : fallbackAdminEmails;

  return admins.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth;
  }

  if (!isAdminEmail(auth.user.email)) {
    return {
      user: null,
      response: NextResponse.json({ error: "Acceso admin requerido." }, { status: 403 }),
    };
  }

  return auth;
}

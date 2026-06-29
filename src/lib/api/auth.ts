import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { createAuditLog } from "@/lib/services/audit.service";
import { ensureUserProfile } from "@/lib/services/profile.service";

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

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return Boolean(adminEmail && email.toLowerCase() === adminEmail);
}

export async function requireAdmin() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth;
  }

  const profile = await ensureUserProfile({
    userId: auth.user.id,
    fullName: auth.user.user_metadata.full_name ?? auth.user.user_metadata.name ?? auth.user.email ?? "Usuario Budgetly",
    email: auth.user.email ?? "",
  });

  if (profile.role !== "admin") {
    await createAuditLog({
      userId: auth.user.id,
      action: "ADMIN_ACCESS_DENIED",
      entity: "profile",
      entityId: profile.id,
    });

    return {
      user: null,
      response: NextResponse.json({ error: "Acceso admin requerido." }, { status: 403 }),
    };
  }

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_ACCESS_GRANTED",
    entity: "profile",
    entityId: profile.id,
  });

  return { ...auth, profile };
}

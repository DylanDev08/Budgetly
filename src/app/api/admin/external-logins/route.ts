import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { maskEmail, maskIdentifier } from "@/lib/utils/privacy";

function unique(values: (string | null | undefined)[]) {
  return [...new Set(values.filter(Boolean) as string[])];
}

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        items: [],
        warning: "SUPABASE_SERVICE_ROLE_KEY no esta configurada para consultar Auth Admin.",
      },
      { status: 200 },
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });

  if (error) {
    console.error("[admin/external-logins] Supabase listUsers failed", {
      name: error.name,
      message: error.message,
      status: error.status,
    });

    return NextResponse.json({ error: "No se pudieron consultar los logins externos." }, { status: 502 });
  }

  const userIds = data.users.map((user) => user.id);
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: userIds } },
    select: {
      userId: true,
      fullName: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_EXTERNAL_LOGINS_VIEWED",
    entity: "auth",
    metadata: { count: data.users.length },
  });

  return NextResponse.json({
    items: data.users.map((user) => {
      const profile = profileByUserId.get(user.id);
      const metadata = user.user_metadata as Record<string, unknown> | null;
      const identityProviders = user.identities?.map((identity) => identity.provider) ?? [];

      return {
        id: maskIdentifier(user.id, 5),
        email: maskEmail(user.email ?? profile?.email ?? null),
        fullName: profile?.fullName ?? String(metadata?.full_name ?? metadata?.name ?? "Usuario sin nombre"),
        providers: unique([user.app_metadata.provider as string | undefined, ...identityProviders]),
        role: profile?.role ?? "sin perfil",
        plan: profile?.plan ?? "sin perfil",
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        emailConfirmedAt: user.email_confirmed_at,
        profileCreatedAt: profile?.createdAt.toISOString() ?? null,
        profileUpdatedAt: profile?.updatedAt.toISOString() ?? null,
        passwordAccess: "No disponible por seguridad",
      };
    }),
  });
}

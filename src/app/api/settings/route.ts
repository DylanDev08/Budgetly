import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { serializeProfile } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { ensureUserProfile } from "@/lib/services/profile.service";
import { settingsSchema } from "@/lib/validations/finance.schema";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const profile = await ensureUserProfile({
    userId: auth.user.id,
    fullName: auth.user.user_metadata.full_name ?? auth.user.email ?? "Usuario Budgetly",
    email: auth.user.email ?? "",
  });

  return NextResponse.json({ item: serializeProfile(profile) });
}

export async function PUT(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.profile.upsert({
    where: { userId: auth.user.id },
    update: parsed.data,
    create: {
      userId: auth.user.id,
      ...parsed.data,
    },
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "SETTINGS_UPDATED",
    entity: "profile",
    entityId: profile.id,
    metadata: { fields: Object.keys(parsed.data) },
  });

  return NextResponse.json({ item: serializeProfile(profile) });
}

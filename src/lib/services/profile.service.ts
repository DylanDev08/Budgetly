import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";

type EnsureUserProfileInput = {
  userId: string;
  fullName: string;
  email: string;
};

function getRoleForEmail(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  return adminEmail && email.toLowerCase() === adminEmail ? "admin" : "user";
}

export async function ensureUserProfile({ userId, fullName, email }: EnsureUserProfileInput) {
  const role = getRoleForEmail(email);
  const existing = await prisma.profile.findUnique({ where: { userId } });

  if (existing) {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        fullName,
        email,
        role: existing.role === "admin" ? "admin" : role,
      },
    });

    if (existing.role !== profile.role) {
      await createAuditLog({
        userId,
        action: "PROFILE_ROLE_UPDATED",
        entity: "profile",
        entityId: profile.id,
        metadata: { role: profile.role },
      });
    }

    return profile;
  }

  const profile = await prisma.profile.create({
    data: {
      userId,
      fullName,
      email,
      role,
      plan: "free",
      currency: "ARS",
      alertMode: "normal",
      riskProfile: "conservador",
      theme: "dark",
    },
  });

  await createAuditLog({
    userId,
    action: "PROFILE_CREATED",
    entity: "profile",
    entityId: profile.id,
  });

  return profile;
}

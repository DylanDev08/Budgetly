import { prisma } from "@/lib/prisma";

type EnsureUserProfileInput = {
  userId: string;
  fullName: string;
  email: string;
};

export async function ensureUserProfile({ userId, fullName, email }: EnsureUserProfileInput) {
  return prisma.profile.upsert({
    where: { userId },
    update: {
      fullName,
      email,
    },
    create: {
      userId,
      fullName,
      email,
      currency: "ARS",
      alertMode: "normal",
      riskProfile: "conservador",
      theme: "dark",
    },
  });
}

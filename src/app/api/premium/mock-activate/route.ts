import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";

export async function POST() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const profile = await prisma.profile.update({
    where: { userId: auth.user.id },
    data: { plan: "premium" },
  });

  try {
    await prisma.paymentEvent.create({
      data: {
        userId: auth.user.id,
        provider: "mock",
        eventType: "SUBSCRIPTION_MOCK_ACTIVATED",
        payload: { plan: "premium" },
      },
    });
  } catch {
    // Payment events are optional until the DB migration is applied.
  }

  await createAuditLog({
    userId: auth.user.id,
    action: "SUBSCRIPTION_MOCK_ACTIVATED",
    entity: "profile",
    entityId: profile.id,
    metadata: { plan: "premium" },
  });

  return NextResponse.json({ success: true, data: { plan: profile.plan } });
}

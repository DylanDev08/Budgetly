import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { createAuditLog } from "@/lib/services/audit.service";

const activitySchema = z.object({
  action: z.enum(["navigation"]),
  href: z.string().trim().min(1).max(160),
  label: z.string().trim().min(1).max(80),
  section: z.string().trim().min(1).max(80).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit({ key: `activity:${ip}`, limit: 90, windowMs: 60_000 });

  if (!limit.allowed) {
    return NextResponse.json({ error: "Demasiadas acciones registradas." }, { status: 429 });
  }

  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = activitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Actividad invalida." }, { status: 400 });
  }

  const metadata = {
    href: parsed.data.href,
    label: parsed.data.label,
    section: parsed.data.section ?? "general",
  };

  await Promise.all([
    createAuditLog({
      userId: auth.user.id,
      action: "NAV_PANEL_CLICK",
      entity: "navigation",
      metadata,
    }),
    prisma.clientActivity
      .create({
        data: {
          userId: auth.user.id,
          action: "navigation",
          title: `Abrio ${parsed.data.label}`,
          summary: parsed.data.href,
          metadata,
        },
      })
      .catch(() => null),
  ]);

  return NextResponse.json({ ok: true });
}

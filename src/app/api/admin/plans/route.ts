import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { adminPlanSchema } from "@/lib/validations/admin.schema";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const items = await prisma.subscriptionPlan.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({
    success: true,
    data: { items: items.map((item) => ({ ...item, price: Number(item.price.toString()), createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })) },
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = adminPlanSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const plan = await prisma.subscriptionPlan.create({ data: parsed.data });

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_PLAN_CREATED",
    entity: "subscription_plan",
    entityId: plan.id,
    metadata: { slug: plan.slug },
  });

  return NextResponse.json({ success: true, data: { item: plan } }, { status: 201 });
}

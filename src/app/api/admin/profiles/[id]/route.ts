import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { serializeAdminProfile } from "@/lib/api/serializers";
import { prisma } from "@/lib/prisma";
import { adminProfileUpdateSchema, idSchema } from "@/lib/validations/finance.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;

  if (!idSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Id invalido" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminProfileUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ item: serializeAdminProfile(profile) });
}

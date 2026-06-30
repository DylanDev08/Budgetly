import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { adminClientNoteSchema } from "@/lib/validations/admin.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const items = await prisma.clientNote.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    success: true,
    data: { items: items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })) },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = adminClientNoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Datos invalidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const note = await prisma.clientNote.create({
    data: {
      userId: id,
      adminId: auth.user.id,
      ...parsed.data,
    },
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "ADMIN_CLIENT_NOTE_CREATED",
    entity: "client_note",
    entityId: note.id,
    metadata: { targetUserId: id },
  });

  return NextResponse.json({ success: true, data: { item: note } }, { status: 201 });
}

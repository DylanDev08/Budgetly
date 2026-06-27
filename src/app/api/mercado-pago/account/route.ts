import { NextResponse } from "next/server";
import { hasDatabaseEnv } from "@/lib/env";
import { getAuthenticatedUser } from "@/lib/auth/getAuthenticatedUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { user, error } = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json({ error }, { status: 401 });
  }

  if (!hasDatabaseEnv()) {
    return NextResponse.json({ connected: false, status: "missing_database" });
  }

  const account = await prisma.mercadoPagoAccount.findUnique({ where: { userId: user.id } });

  return NextResponse.json({
    connected: Boolean(account),
    status: account?.syncStatus ?? "not_connected",
    accountEmail: account?.accountEmail ?? null,
    expiresAt: account?.expiresAt?.toISOString() ?? null,
    lastSync: account?.lastSync?.toISOString() ?? null,
  });
}

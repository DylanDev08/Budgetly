import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { hasDatabaseEnv, hasSupabaseEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const [profiles, transactions, auditLogs, uploads, extractions] = await Promise.all([
    prisma.profile.count(),
    prisma.transaction.count(),
    prisma.auditLog.count(),
    prisma.uploadedAsset.count().catch(() => 0),
    prisma.extractedFinancialData.count().catch(() => 0),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      environment: {
        supabase: hasSupabaseEnv(),
        database: hasDatabaseEnv(),
        mercadoPagoClient: Boolean(process.env.MERCADO_PAGO_CLIENT_ID),
      },
      counts: {
        profiles,
        transactions,
        auditLogs,
        uploads,
        extractions,
      },
    },
  });
}

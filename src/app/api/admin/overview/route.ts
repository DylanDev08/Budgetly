import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/auth";
import { hasDatabaseEnv, hasSupabaseEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { maskEmail, maskIdentifier } from "@/lib/utils/privacy";

function money(value: { toString(): string }) {
  return Number(value.toString());
}

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.user) {
    return auth.response;
  }

  const monthStart = startOfMonth();

  const [
    profiles,
    profileCount,
    transactions,
    transactionCount,
    pendingObligations,
    uploads,
    extractions,
    mercadoPagoAccounts,
    auditLogs,
    planGroups,
  ] = await Promise.all([
    prisma.profile.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        userId: true,
        fullName: true,
        email: true,
        plan: true,
        status: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
      },
    }),
    prisma.profile.count(),
    prisma.transaction.findMany({
      where: { date: { gte: monthStart } },
      orderBy: { date: "desc" },
      take: 500,
      select: {
        id: true,
        userId: true,
        kind: true,
        amount: true,
        category: true,
        source: true,
        date: true,
      },
    }),
    prisma.transaction.count(),
    prisma.obligation.count({ where: { status: "pendiente" } }),
    prisma.uploadedAsset.count().catch(() => 0),
    prisma.extractedFinancialData.count().catch(() => 0),
    prisma.mercadoPagoAccount.count().catch(() => 0),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        userId: true,
        action: true,
        entity: true,
        createdAt: true,
      },
    }),
    prisma.profile.groupBy({
      by: ["plan"],
      _count: { _all: true },
    }),
  ]);

  const monthlyIncome = transactions
    .filter((transaction) => transaction.kind === "income")
    .reduce((acc, transaction) => acc + money(transaction.amount), 0);
  const monthlyExpense = transactions
    .filter((transaction) => transaction.kind === "expense")
    .reduce((acc, transaction) => acc + money(transaction.amount), 0);
  const sourceCounts = transactions.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.source] = (acc[transaction.source] ?? 0) + 1;
    return acc;
  }, {});
  const planCounts = Object.fromEntries(planGroups.map((item) => [item.plan, item._count._all]));

  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        clients: profileCount,
        transactions: transactionCount,
        monthlyIncome,
        monthlyExpense,
        monthlyBalance: monthlyIncome - monthlyExpense,
        pendingObligations,
        uploads,
        extractions,
        mercadoPagoAccounts,
      },
      sourceCounts,
      planCounts,
      recentClients: profiles.map((profile) => ({
        userId: profile.userId,
        userLabel: maskIdentifier(profile.userId, 5),
        fullName: profile.fullName ?? "Usuario sin nombre",
        email: maskEmail(profile.email),
        plan: profile.plan,
        status: profile.status,
        role: profile.role,
        lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
        createdAt: profile.createdAt.toISOString(),
      })),
      recentActivity: auditLogs.map((log) => ({
        id: log.id,
        userLabel: maskIdentifier(log.userId, 5),
        action: log.action,
        entity: log.entity,
        createdAt: log.createdAt.toISOString(),
      })),
      security: {
        supabase: hasSupabaseEnv(),
        database: hasDatabaseEnv(),
        rlsMode: "owner_only",
        sensitiveTables: "server_only",
        exposedCredentials: false,
      },
    },
  });
}

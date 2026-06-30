import { getNextBestAction } from "@/lib/domain/nextBestAction";
import { prisma } from "@/lib/prisma";

function decimal(value: { toString(): string }) {
  return Number(value.toString());
}

export async function getSmartInbox(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [profile, transactions, obligations, extractions, assets, invoices, mercadoPago] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId, date: { gte: monthStart } }, take: 200 }),
    prisma.obligation.findMany({ where: { userId, status: "pendiente" }, orderBy: { dueDay: "asc" }, take: 8 }),
    prisma.extractedFinancialData.findMany({
      where: { userId, status: { in: ["pending_confirmation", "needs_review"] } },
      orderBy: { createdAt: "desc" },
      take: 12,
    }).catch(() => []),
    prisma.uploadedAsset.findMany({
      where: { userId, status: { in: ["uploaded", "storage_pending"] } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }).catch(() => []),
    prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.mercadoPagoAccount.findUnique({ where: { userId } }),
  ]);

  const income = transactions.filter((item) => item.kind === "income").reduce((acc, item) => acc + decimal(item.amount), 0);
  const expenses = transactions.filter((item) => item.kind === "expense").reduce((acc, item) => acc + decimal(item.amount), 0);
  const monthlyBudget = Number(profile?.monthlyBudget?.toString() ?? 0);
  const budgetUsed = monthlyBudget > 0 ? Math.round((expenses / monthlyBudget) * 100) : 0;
  const action = getNextBestAction({
    income,
    expenses,
    budgetUsed,
    pendingObligations: obligations.length,
    activeGoals: 0,
    mercadoPagoConnected: Boolean(mercadoPago),
    plan: profile?.plan ?? "free",
    pendingExtractions: extractions.length,
    pendingUploads: assets.length,
  });

  return {
    pendingExtractions: extractions.map((item) => ({
      id: item.id,
      concept: item.concept,
      amount: item.amount ? Number(item.amount.toString()) : null,
      confidence: Number(item.confidence.toString()),
      status: item.status,
      createdAt: item.createdAt.toISOString(),
    })),
    pendingUploads: assets.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      kind: item.kind,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
    })),
    upcomingObligations: obligations.map((item) => ({
      id: item.id,
      name: item.name,
      amount: decimal(item.amount),
      dueDay: item.dueDay,
    })),
    latestInvoices: invoices.map((item) => ({
      id: item.id,
      invoiceNumber: item.invoiceNumber,
      concept: item.concept,
      amount: decimal(item.amount),
    })),
    recommendations: [action],
  };
}

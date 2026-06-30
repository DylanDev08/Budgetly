import { prisma } from "@/lib/prisma";
import { maskEmail } from "@/lib/utils/privacy";

function money(value: { toString(): string }) {
  return Number(value.toString());
}

function planTone(plan: string) {
  if (plan === "pro") return "pro";
  if (plan === "premium") return "premium";
  return "free";
}

export async function listAdminClients() {
  const profiles = await prisma.profile.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  const userIds = profiles.map((profile) => profile.userId);
  const [transactions, uploads, extractions] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { id: true },
    }),
    prisma.uploadedAsset.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { id: true },
    }).catch(() => []),
    prisma.extractedFinancialData.groupBy({
      by: ["userId"],
      where: { userId: { in: userIds } },
      _count: { id: true },
    }).catch(() => []),
  ]);

  const transactionCount = new Map(transactions.map((item) => [item.userId, item._count.id]));
  const uploadCount = new Map(uploads.map((item) => [item.userId, item._count.id]));
  const extractionCount = new Map(extractions.map((item) => [item.userId, item._count.id]));

  return profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    fullName: profile.fullName,
    email: maskEmail(profile.email),
    emailMasked: maskEmail(profile.email),
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    plan: profile.plan,
    planTone: planTone(profile.plan),
    status: profile.status,
    lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
    createdAt: profile.createdAt.toISOString(),
    movements: transactionCount.get(profile.userId) ?? 0,
    uploads: uploadCount.get(profile.userId) ?? 0,
    extractions: extractionCount.get(profile.userId) ?? 0,
    activityLevel: (transactionCount.get(profile.userId) ?? 0) + (uploadCount.get(profile.userId) ?? 0) > 10 ? "alta" : "normal",
  }));
}

export async function getAdminClientDetail(userId: string) {
  const [
    profile,
    transactions,
    budgets,
    obligations,
    goals,
    routines,
    scheduleBlocks,
    uploadedAssets,
    extractedFinancialData,
    assistantMessages,
    invoices,
    auditLogs,
    clientActivities,
    clientNotes,
  ] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 20, include: { invoice: true } }),
    prisma.budget.findMany({ where: { userId }, take: 20 }),
    prisma.obligation.findMany({ where: { userId }, take: 20 }),
    prisma.goal.findMany({ where: { userId }, take: 20 }),
    prisma.routine.findMany({ where: { userId }, take: 20 }),
    prisma.scheduleBlock.findMany({ where: { userId }, take: 20 }),
    prisma.uploadedAsset.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
    prisma.extractedFinancialData.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
    prisma.assistantMessage.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.invoice.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.auditLog.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.clientActivity.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 40 }).catch(() => []),
    prisma.clientNote.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => []),
  ]);

  if (!profile) {
    return null;
  }

  const income = transactions.filter((item) => item.kind === "income").reduce((acc, item) => acc + money(item.amount), 0);
  const expenses = transactions.filter((item) => item.kind === "expense").reduce((acc, item) => acc + money(item.amount), 0);

  return {
    profile: {
      ...profile,
      email: maskEmail(profile.email),
      emailMasked: maskEmail(profile.email),
      monthlyBudget: money(profile.monthlyBudget),
      weeklyBudget: money(profile.weeklyBudget),
      variableBudget: money(profile.variableBudget),
      monthlySavingsGoal: money(profile.monthlySavingsGoal),
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      lastLoginAt: profile.lastLoginAt?.toISOString() ?? null,
    },
    metrics: {
      income,
      expenses,
      balance: income - expenses,
      transactions: transactions.length,
      uploads: uploadedAssets.length,
      extractions: extractedFinancialData.length,
      assistantMessages: assistantMessages.length,
    },
    transactions: transactions.map((item) => ({ ...item, amount: money(item.amount), date: item.date.toISOString().slice(0, 10) })),
    budgets: budgets.map((item) => ({ ...item, limitAmount: money(item.limitAmount) })),
    obligations: obligations.map((item) => ({ ...item, amount: money(item.amount) })),
    goals: goals.map((item) => ({ ...item, targetAmount: money(item.targetAmount), currentAmount: money(item.currentAmount) })),
    routines,
    scheduleBlocks,
    uploadedAssets: uploadedAssets.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })),
    extractedFinancialData: extractedFinancialData.map((item) => ({
      ...item,
      amount: item.amount ? Number(item.amount.toString()) : null,
      confidence: Number(item.confidence.toString()),
      date: item.date?.toISOString().slice(0, 10) ?? null,
      createdAt: item.createdAt.toISOString(),
      confirmedAt: item.confirmedAt?.toISOString() ?? null,
    })),
    assistantMessages: assistantMessages.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    invoices: invoices.map((item) => ({ ...item, amount: money(item.amount), createdAt: item.createdAt.toISOString() })),
    auditLogs: auditLogs.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    clientActivities: clientActivities.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() })),
    clientNotes: clientNotes.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString() })),
  };
}

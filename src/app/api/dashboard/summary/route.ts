import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { calculateBudgetlyPulse } from "@/lib/domain/budgetlyPulse";
import { getNextBestAction } from "@/lib/domain/nextBestAction";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [profile, transactions, budgets, obligations, pendingObligationCount, goals, invoices, mercadoPago, pendingUploads, pendingExtractions] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: auth.user.id } }),
    prisma.transaction.findMany({
      where: { userId: auth.user.id, date: { gte: monthStart } },
      orderBy: { date: "desc" },
      take: 200,
    }),
    prisma.budget.findMany({ where: { userId: auth.user.id } }),
    prisma.obligation.findMany({ where: { userId: auth.user.id, status: "pendiente" }, orderBy: { dueDay: "asc" }, take: 5 }),
    prisma.obligation.count({ where: { userId: auth.user.id, status: "pendiente" } }),
    prisma.goal.findMany({ where: { userId: auth.user.id, status: "activa" }, take: 5 }),
    prisma.invoice.findMany({ where: { userId: auth.user.id }, orderBy: { date: "desc" }, take: 5 }),
    prisma.mercadoPagoAccount.findUnique({ where: { userId: auth.user.id } }),
    prisma.uploadedAsset.count({ where: { userId: auth.user.id, status: { in: ["uploaded", "storage_pending"] } } }).catch(() => 0),
    prisma.extractedFinancialData.count({ where: { userId: auth.user.id, status: "pending" } }).catch(() => 0),
  ]);

  const income = transactions.filter((item) => item.kind === "income").reduce((acc, item) => acc + Number(item.amount.toString()), 0);
  const expense = transactions.filter((item) => item.kind === "expense").reduce((acc, item) => acc + Number(item.amount.toString()), 0);
  const weeklyExpense = transactions
    .filter((item) => item.kind === "expense" && item.date >= weekStart)
    .reduce((acc, item) => acc + Number(item.amount.toString()), 0);
  const monthlyBudget = Number(profile?.monthlyBudget?.toString() ?? budgets.find((item) => item.type === "mensual")?.limitAmount.toString() ?? 0);
  const weeklyBudget = Number(profile?.weeklyBudget?.toString() ?? budgets.find((item) => item.type === "semanal")?.limitAmount.toString() ?? 0);
  const monthlySavingsGoal = Number(profile?.monthlySavingsGoal?.toString() ?? 0);
  const budgetUsed = monthlyBudget > 0 ? Math.round((expense / monthlyBudget) * 100) : 0;
  const categories = new Map<string, number>();

  for (const item of transactions) {
    if (item.kind === "expense") {
      categories.set(item.category, (categories.get(item.category) ?? 0) + Number(item.amount.toString()));
    }
  }

  const topCategory = [...categories.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
  const pulse = calculateBudgetlyPulse({
    income,
    expenses: expense,
    weeklyExpense,
    monthlyBudget,
    weeklyBudget,
    monthlySavingsGoal,
    pendingObligations: pendingObligationCount,
    activeGoals: goals.map((goal) => ({
      targetAmount: Number(goal.targetAmount.toString()),
      currentAmount: Number(goal.currentAmount.toString()),
    })),
  });
  const nextBestAction = getNextBestAction({
    income,
    expenses: expense,
    budgetUsed,
    pendingObligations: pendingObligationCount,
    activeGoals: goals.length,
    mercadoPagoConnected: Boolean(mercadoPago),
    plan: profile?.plan ?? "free",
    pendingUploads,
    pendingExtractions,
  });

  return NextResponse.json({
    currency: profile?.currency ?? "ARS",
    plan: profile?.plan ?? "free",
    income,
    expense,
    balance: income - expense,
    weeklyExpense,
    budgetUsed,
    health: budgetUsed >= 120 ? "critico" : budgetUsed >= 80 ? "advertencia" : "bien",
    pulse,
    nextBestAction,
    topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    recentTransactions: transactions.slice(0, 5).map((item) => ({
      id: item.id,
      name: item.name,
      kind: item.kind,
      amount: Number(item.amount.toString()),
      date: item.date.toISOString().slice(0, 10),
    })),
    obligations: obligations.map((item) => ({ id: item.id, name: item.name, amount: Number(item.amount.toString()), dueDay: item.dueDay })),
    goals: goals.map((item) => ({ id: item.id, name: item.name, targetAmount: Number(item.targetAmount.toString()), currentAmount: Number(item.currentAmount.toString()) })),
    invoices: invoices.map((item) => ({ id: item.id, invoiceNumber: item.invoiceNumber, concept: item.concept, amount: Number(item.amount.toString()) })),
    mercadoPagoConnected: Boolean(mercadoPago),
  });
}

import { calculateBudgetlyPulse } from "@/lib/domain/budgetlyPulse";
import { getNextBestAction } from "@/lib/domain/nextBestAction";
import { prisma } from "@/lib/prisma";

function decimal(value: { toString(): string } | null | undefined) {
  return Number(value?.toString() ?? 0);
}

export async function getPulseContext(userId: string) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const [profile, transactions, obligations, goals, mercadoPago] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.transaction.findMany({ where: { userId, date: { gte: monthStart } }, take: 300 }),
    prisma.obligation.findMany({ where: { userId, status: "pendiente" } }),
    prisma.goal.findMany({ where: { userId, status: "activa" } }),
    prisma.mercadoPagoAccount.findUnique({ where: { userId } }),
  ]);

  const income = transactions.filter((item) => item.kind === "income").reduce((acc, item) => acc + decimal(item.amount), 0);
  const expenses = transactions.filter((item) => item.kind === "expense").reduce((acc, item) => acc + decimal(item.amount), 0);
  const weeklyExpense = transactions
    .filter((item) => item.kind === "expense" && item.date >= weekStart)
    .reduce((acc, item) => acc + decimal(item.amount), 0);
  const monthlyBudget = decimal(profile?.monthlyBudget);
  const weeklyBudget = decimal(profile?.weeklyBudget);
  const monthlySavingsGoal = decimal(profile?.monthlySavingsGoal);
  const budgetUsed = monthlyBudget > 0 ? Math.round((expenses / monthlyBudget) * 100) : 0;

  const pulse = calculateBudgetlyPulse({
    income,
    expenses,
    weeklyExpense,
    monthlyBudget,
    weeklyBudget,
    monthlySavingsGoal,
    pendingObligations: obligations.length,
    activeGoals: goals.map((goal) => ({
      targetAmount: decimal(goal.targetAmount),
      currentAmount: decimal(goal.currentAmount),
    })),
  });

  const nextBestAction = getNextBestAction({
    income,
    expenses,
    budgetUsed,
    pendingObligations: obligations.length,
    activeGoals: goals.length,
    mercadoPagoConnected: Boolean(mercadoPago),
    plan: profile?.plan ?? "free",
  });

  return {
    profile,
    income,
    expenses,
    weeklyExpense,
    monthlyBudget,
    weeklyBudget,
    monthlySavingsGoal,
    pendingObligationsAmount: obligations.reduce((acc, item) => acc + decimal(item.amount), 0),
    obligations,
    goals,
    mercadoPago,
    pulse,
    nextBestAction,
  };
}

import type { Prisma } from "@prisma/client";
import { simulateDecision } from "@/lib/domain/decisionEngine";
import { prisma } from "@/lib/prisma";
import { getPulseContext } from "@/lib/services/pulse.service";

type SimulateDecisionInput = {
  userId: string;
  title: string;
  type: "purchase" | "save" | "pay_obligation" | "invest";
  amount: number;
};

export async function runDecisionSimulation(input: SimulateDecisionInput) {
  const context = await getPulseContext(input.userId);
  const result = simulateDecision({
    title: input.title,
    type: input.type,
    amount: input.amount,
    monthlyBalance: context.income - context.expenses,
    weeklyExpense: context.weeklyExpense,
    weeklyBudget: context.weeklyBudget,
    monthlySavingsGoal: context.monthlySavingsGoal,
    pendingObligationsAmount: context.pendingObligationsAmount,
    riskProfile: context.profile?.riskProfile ?? "conservador",
  });

  try {
    await prisma.decisionSimulation.create({
      data: {
        userId: input.userId,
        title: input.title,
        type: input.type,
        amount: input.amount,
        result: result as Prisma.InputJsonValue,
      },
    });
  } catch {
    // The simulator should still work before the optional table is pushed.
  }

  return result;
}

export async function getRecentDecisionSimulations(userId: string) {
  try {
    return await prisma.decisionSimulation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  } catch {
    return [];
  }
}

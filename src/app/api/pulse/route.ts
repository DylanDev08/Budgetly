import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api/auth";
import { getPulseContext } from "@/lib/services/pulse.service";

export async function GET() {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const context = await getPulseContext(auth.user.id);

  return NextResponse.json({
    success: true,
    data: {
      pulse: context.pulse,
      nextBestAction: context.nextBestAction,
      metrics: {
        income: context.income,
        expenses: context.expenses,
        weeklyExpense: context.weeklyExpense,
        monthlyBudget: context.monthlyBudget,
        weeklyBudget: context.weeklyBudget,
        pendingObligations: context.obligations.length,
        activeGoals: context.goals.length,
      },
    },
  });
}

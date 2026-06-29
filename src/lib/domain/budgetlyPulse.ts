export type BudgetlyPulseInput = {
  income: number;
  expenses: number;
  weeklyExpense: number;
  monthlyBudget: number;
  weeklyBudget: number;
  monthlySavingsGoal: number;
  pendingObligations: number;
  activeGoals: { targetAmount: number; currentAmount: number }[];
};

export type BudgetlyPulseResult = {
  score: number;
  status: "Critico" | "Atencion" | "Estable" | "Fuerte" | "Excelente";
  factors: {
    incomeStability: number;
    expenseControl: number;
    obligationCompliance: number;
    goalProgress: number;
    savingsLevel: number;
    budgetRisk: number;
  };
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function ratioScore(value: number, target: number, inverted = false) {
  if (target <= 0) {
    return 55;
  }

  const ratio = value / target;
  const score = inverted ? 100 - ratio * 100 : ratio * 100;

  return clampScore(score);
}

function getStatus(score: number): BudgetlyPulseResult["status"] {
  if (score < 35) return "Critico";
  if (score < 55) return "Atencion";
  if (score < 75) return "Estable";
  if (score < 90) return "Fuerte";
  return "Excelente";
}

export function calculateBudgetlyPulse(input: BudgetlyPulseInput): BudgetlyPulseResult {
  const balance = input.income - input.expenses;
  const averageGoalProgress = input.activeGoals.length
    ? input.activeGoals.reduce((acc, goal) => acc + ratioScore(goal.currentAmount, goal.targetAmount), 0) / input.activeGoals.length
    : 50;

  const factors = {
    incomeStability: input.income > 0 ? 82 : 35,
    expenseControl: input.monthlyBudget > 0 ? ratioScore(input.expenses, input.monthlyBudget, true) : input.expenses > 0 ? 45 : 65,
    obligationCompliance: clampScore(100 - input.pendingObligations * 12),
    goalProgress: clampScore(averageGoalProgress),
    savingsLevel: input.monthlySavingsGoal > 0 ? ratioScore(Math.max(balance, 0), input.monthlySavingsGoal) : balance > 0 ? 70 : 40,
    budgetRisk: input.weeklyBudget > 0 ? ratioScore(input.weeklyExpense, input.weeklyBudget, true) : 55,
  };

  const score = clampScore(
    factors.incomeStability * 0.16 +
      factors.expenseControl * 0.22 +
      factors.obligationCompliance * 0.16 +
      factors.goalProgress * 0.16 +
      factors.savingsLevel * 0.18 +
      factors.budgetRisk * 0.12,
  );

  return {
    score,
    status: getStatus(score),
    factors,
  };
}

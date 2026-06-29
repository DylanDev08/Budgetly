export type SpendingGuardInput = {
  amount: number;
  weeklyExpense: number;
  weeklyBudget: number;
  monthlySavingsGoal: number;
  monthlyBalance: number;
  pendingObligationsAmount: number;
};

export type SpendingGuardAlert = {
  level: "info" | "warning" | "critical";
  message: string;
};

export function analyzeSpendingGuard(input: SpendingGuardInput): SpendingGuardAlert[] {
  const alerts: SpendingGuardAlert[] = [];

  if (input.monthlySavingsGoal > 0 && input.monthlyBalance - input.amount < input.monthlySavingsGoal) {
    alerts.push({
      level: "warning",
      message: "Este gasto puede comprometer tu meta de ahorro mensual.",
    });
  }

  if (input.weeklyBudget > 0 && input.weeklyExpense + input.amount > input.weeklyBudget) {
    alerts.push({
      level: "critical",
      message: "Este gasto supera tu limite semanal configurado.",
    });
  }

  if (input.pendingObligationsAmount > 0 && input.monthlyBalance - input.amount < input.pendingObligationsAmount) {
    alerts.push({
      level: "warning",
      message: "Este gasto puede afectar una obligacion proxima.",
    });
  }

  if (alerts.length === 0 && input.amount > 0) {
    alerts.push({
      level: "info",
      message: "El gasto no activa alertas fuertes con los datos actuales.",
    });
  }

  return alerts;
}

import { analyzeSpendingGuard } from "@/lib/domain/spendingGuard";

export type DecisionSimulationInput = {
  title: string;
  type: "purchase" | "save" | "pay_obligation" | "invest";
  amount: number;
  monthlyBalance: number;
  weeklyExpense: number;
  weeklyBudget: number;
  monthlySavingsGoal: number;
  pendingObligationsAmount: number;
  riskProfile: string;
};

export function simulateDecision(input: DecisionSimulationInput) {
  const projectedBalance = input.type === "save" ? input.monthlyBalance : input.monthlyBalance - input.amount;
  const alerts = analyzeSpendingGuard({
    amount: input.amount,
    weeklyExpense: input.weeklyExpense,
    weeklyBudget: input.weeklyBudget,
    monthlySavingsGoal: input.monthlySavingsGoal,
    monthlyBalance: input.monthlyBalance,
    pendingObligationsAmount: input.pendingObligationsAmount,
  });

  const canProceed = projectedBalance >= 0 && !alerts.some((alert) => alert.level === "critical");
  const educationalDisclaimer =
    "Este resultado es educativo y orientativo. No constituye asesoramiento financiero profesional.";

  return {
    canProceed,
    projectedBalance,
    impact: projectedBalance - input.monthlyBalance,
    riskLevel: input.type === "invest" ? input.riskProfile : canProceed ? "bajo" : "alto",
    recommendation: canProceed
      ? "La decision parece posible con los datos actuales, pero revisa obligaciones y metas antes de confirmar."
      : "Conviene pausar esta decision o reducir el monto para no comprometer tu presupuesto.",
    alerts,
    scenarios: {
      conservative: Math.max(projectedBalance - input.amount * 0.1, 0),
      moderate: projectedBalance,
      aggressive: projectedBalance + (input.type === "invest" ? input.amount * 0.08 : 0),
    },
    educationalDisclaimer,
  };
}

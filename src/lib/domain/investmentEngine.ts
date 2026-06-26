export function evaluateInvestmentReadiness(balance: number, pendingObligations: number) {
  if (balance <= 0 || pendingObligations > 0) {
    return {
      canInvest: false,
      availableToInvest: 0,
      riskLevel: "bajo",
      recommendation: "No invertir todavia. Primero ordena obligaciones y gastos variables.",
      warnings: pendingObligations > 0 ? ["Tenes obligaciones pendientes"] : ["Balance insuficiente"],
    };
  }

  return {
    canInvest: true,
    availableToInvest: balance,
    riskLevel: "moderado",
    recommendation: "Podrias evaluar una inversion educativa acorde a tu perfil de riesgo.",
    warnings: [],
  };
}

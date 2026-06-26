export function getBudgetStatus(usedPercentage: number) {
  if (usedPercentage >= 120) return "critico";
  if (usedPercentage >= 100) return "alerta";
  if (usedPercentage >= 80) return "advertencia";
  return "bien";
}

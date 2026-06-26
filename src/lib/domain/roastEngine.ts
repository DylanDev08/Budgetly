import type { AlertMode } from "@/types/finance";

export function formatBudgetAlert(mode: AlertMode) {
  if (mode === "humoristico") {
    return "Te pasaste del presupuesto mensual. Afloja un poco porque la billetera ya esta pidiendo auxilio.";
  }

  if (mode === "serio") {
    return "Superaste el presupuesto mensual configurado. Revisa tus gastos variables.";
  }

  return "Estas por encima del presupuesto. Conviene ajustar algunos gastos esta semana.";
}

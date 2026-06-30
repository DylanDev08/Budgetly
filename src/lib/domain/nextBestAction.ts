export type NextBestActionInput = {
  income: number;
  expenses: number;
  budgetUsed: number;
  pendingObligations: number;
  activeGoals: number;
  mercadoPagoConnected: boolean;
  plan: string;
  pendingExtractions?: number;
  pendingUploads?: number;
};

export type NextBestAction = {
  key: string;
  title: string;
  description: string;
  href: string;
};

export function getNextBestAction(input: NextBestActionInput): NextBestAction {
  if (input.income <= 0) {
    return {
      key: "load_income",
      title: "Carga tu primer ingreso",
      description: "Sin ingresos registrados, Budgetly no puede calcular salud financiera real.",
      href: "/movements",
    };
  }

  if ((input.pendingExtractions ?? 0) > 0) {
    return {
      key: "confirm_extraction",
      title: "Confirma datos extraidos",
      description: "Tenes comprobantes con datos detectados esperando revision.",
      href: "/inbox",
    };
  }

  if ((input.pendingUploads ?? 0) > 0) {
    return {
      key: "review_photo",
      title: "Revisa fotos subidas",
      description: "Hay imagenes pendientes de ordenar en tu Smart Inbox.",
      href: "/inbox",
    };
  }

  if (input.budgetUsed >= 100) {
    return {
      key: "reduce_spending",
      title: "Revisa gastos variables",
      description: "El presupuesto mensual esta superado o muy cerca del limite.",
      href: "/budgets",
    };
  }

  if (input.pendingObligations > 0) {
    return {
      key: "pay_obligation",
      title: "Ordena obligaciones pendientes",
      description: "Resolver vencimientos baja riesgo financiero y mejora tu Pulse.",
      href: "/obligations",
    };
  }

  if (input.activeGoals === 0 && input.income > input.expenses) {
    return {
      key: "create_goal",
      title: "Crea una meta de ahorro",
      description: "Tenes balance positivo. Converti ese margen en una meta concreta.",
      href: "/goals",
    };
  }

  if (!input.mercadoPagoConnected) {
    return {
      key: "sync_mp",
      title: "Sincroniza Mercado Pago",
      description: "Importar movimientos mejora el contexto de gastos cotidianos.",
      href: "/mercado-pago",
    };
  }

  if (input.plan === "free") {
    return {
      key: "upgrade_premium",
      title: "Explora Premium",
      description: "Desbloquea Pulse completo, decisiones y alertas avanzadas.",
      href: "/premium",
    };
  }

  return {
    key: "review_dashboard",
    title: "Revisa tu command center",
    description: "Tu base esta ordenada. Mira el dashboard para decidir el siguiente movimiento.",
    href: "/dashboard",
  };
}

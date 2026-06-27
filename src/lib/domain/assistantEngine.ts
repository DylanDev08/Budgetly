type AssistantTransaction = {
  kind: "income" | "expense";
  name: string;
  amount: number;
  category: string;
  date: string | null;
};

type AssistantBudget = {
  name: string;
  category: string | null;
  limitAmount: number;
};

type AssistantObligation = {
  name: string;
  amount: number;
  status: string;
  dueDay: number;
};

type AssistantGoal = {
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: string;
};

export type AssistantContext = {
  transactions: AssistantTransaction[];
  budgets: AssistantBudget[];
  obligations: AssistantObligation[];
  goals: AssistantGoal[];
  currency: string;
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function totals(transactions: AssistantTransaction[]) {
  return transactions.reduce(
    (acc, transaction) => {
      if (transaction.kind === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 },
  );
}

function topExpenseCategory(transactions: AssistantTransaction[]) {
  const categories = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.kind !== "expense") {
      continue;
    }

    categories.set(transaction.category, (categories.get(transaction.category) ?? 0) + transaction.amount);
  }

  return [...categories.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
}

export function answerBudgetlyQuestion(question: string, context: AssistantContext) {
  const query = normalize(question);
  const { income, expense } = totals(context.transactions);
  const balance = income - expense;
  const topCategory = topExpenseCategory(context.transactions);
  const pendingObligations = context.obligations.filter((obligation) => obligation.status === "pendiente");
  const activeGoals = context.goals.filter((goal) => goal.status === "activa");

  if (context.transactions.length === 0 && context.budgets.length === 0 && pendingObligations.length === 0) {
    return "Todavia no tengo datos suficientes para responder con precision. Carga algunos movimientos, presupuestos u obligaciones y te ayudo con un diagnostico real.";
  }

  if (query.includes("gastando mas") || query.includes("gasto mas") || query.includes("categoria")) {
    if (!topCategory) {
      return "Todavia no veo egresos cargados. Cuando registres gastos, te voy a marcar la categoria de mayor impacto.";
    }

    return `Tu mayor gasto registrado esta en ${topCategory[0]} con ${formatMoney(topCategory[1], context.currency)}. Revisaria esa categoria primero antes de recortar gastos chicos.`;
  }

  if (query.includes("gastando mucho") || query.includes("presupuesto") || query.includes("limite")) {
    const monthlyBudget = context.budgets.find((budget) => normalize(budget.name).includes("mensual"));

    if (!monthlyBudget) {
      return `Tus gastos cargados suman ${formatMoney(expense, context.currency)}. Todavia no tenes un presupuesto mensual cargado, asi que no puedo decir si estas excedido sin inventar un limite.`;
    }

    const used = monthlyBudget.limitAmount > 0 ? (expense / monthlyBudget.limitAmount) * 100 : 0;
    const state = used >= 120 ? "critico" : used >= 100 ? "excedido" : used >= 80 ? "en advertencia" : "controlado";

    return `Usaste el ${Math.round(used)}% de ${monthlyBudget.name}. Estado: ${state}. Gasto registrado: ${formatMoney(expense, context.currency)} sobre ${formatMoney(monthlyBudget.limitAmount, context.currency)}.`;
  }

  if (query.includes("puedo comprar") || query.includes("comprar")) {
    if (balance <= 0) {
      return `Hoy no te recomendaria comprar algo extra: tu balance cargado es ${formatMoney(balance, context.currency)}. Primero ordenaria gastos y obligaciones pendientes.`;
    }

    return `Con los datos actuales tenes un balance positivo de ${formatMoney(balance, context.currency)}. Si la compra no afecta obligaciones pendientes ni metas prioritarias, podria ser viable; igual cargala como objetivo para medir impacto.`;
  }

  if (query.includes("meta") || query.includes("falta")) {
    const goal = activeGoals[0];

    if (!goal) {
      return "No veo metas activas. Crea una meta con monto objetivo y monto actual, y puedo decirte cuanto falta y que ritmo de aporte conviene.";
    }

    const missing = Math.max(goal.targetAmount - goal.currentAmount, 0);
    const progress = goal.targetAmount > 0 ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0;

    return `Para ${goal.name} te faltan ${formatMoney(missing, context.currency)}. Vas por el ${progress}% de avance.`;
  }

  if (query.includes("obligacion") || query.includes("pendiente") || query.includes("venc")) {
    if (pendingObligations.length === 0) {
      return "No veo obligaciones pendientes cargadas. Buen punto de control: mantenelas actualizadas para que el balance sea real.";
    }

    const summary = pendingObligations
      .slice(0, 3)
      .map((item) => `${item.name} vence el dia ${item.dueDay} por ${formatMoney(item.amount, context.currency)}`)
      .join("; ");

    return `Tenes ${pendingObligations.length} obligaciones pendientes. Las primeras: ${summary}.`;
  }

  if (query.includes("invertir") || query.includes("inversion")) {
    if (balance <= 0 || pendingObligations.length > 0) {
      return "No invertiria todavia. Primero dejaria obligaciones al dia y balance positivo. Budgetly solo da recomendaciones educativas, no ejecuta compras ni ventas.";
    }

    return `Podrias evaluar inversion educativa con cautela: balance positivo de ${formatMoney(balance, context.currency)} y ${pendingObligations.length} obligaciones pendientes. Reserva fondo de emergencia antes de asumir riesgo.`;
  }

  return `Veo ingresos por ${formatMoney(income, context.currency)}, gastos por ${formatMoney(expense, context.currency)} y balance de ${formatMoney(balance, context.currency)}. Preguntame por gastos, metas, obligaciones, presupuesto o inversion y te respondo con esos datos.`;
}

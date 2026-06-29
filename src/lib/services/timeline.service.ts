import { prisma } from "@/lib/prisma";

function decimal(value: { toString(): string }) {
  return Number(value.toString());
}

export async function getFinancialTimeline(userId: string) {
  const [transactions, obligations, goals] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 120,
      include: { invoice: true },
    }),
    prisma.obligation.findMany({
      where: { userId },
      orderBy: { dueDay: "asc" },
      take: 40,
    }),
    prisma.goal.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 40,
    }),
  ]);

  const now = new Date();
  const obligationEvents = obligations.map((obligation) => {
    const date = new Date(now.getFullYear(), now.getMonth(), Math.min(obligation.dueDay, 28));

    return {
      id: `obligation-${obligation.id}`,
      type: "obligation",
      title: obligation.name,
      amount: decimal(obligation.amount),
      date: date.toISOString(),
      status: obligation.status,
      detail: `${obligation.category} / vence dia ${obligation.dueDay}`,
    };
  });

  const goalEvents = goals.map((goal) => ({
    id: `goal-${goal.id}`,
    type: "goal",
    title: goal.name,
    amount: decimal(goal.currentAmount),
    date: goal.updatedAt.toISOString(),
    status: goal.status,
    detail: `Progreso hacia ${decimal(goal.targetAmount)}`,
  }));

  const transactionEvents = transactions.map((transaction) => ({
    id: `transaction-${transaction.id}`,
    type: transaction.kind,
    title: transaction.name,
    amount: decimal(transaction.amount),
    date: transaction.date.toISOString(),
    status: transaction.source,
    detail: `${transaction.category}${transaction.invoice ? ` / ${transaction.invoice.invoiceNumber}` : ""}`,
  }));

  return [...transactionEvents, ...obligationEvents, ...goalEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

import { NextResponse } from "next/server";
import { answerBudgetlyQuestion } from "@/lib/domain/assistantEngine";
import { requireUser } from "@/lib/api/auth";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/services/audit.service";
import { assistantQuestionSchema } from "@/lib/validations/finance.schema";

export async function POST(request: Request) {
  const auth = await requireUser();

  if (!auth.user) {
    return auth.response;
  }

  const body = await request.json().catch(() => null);
  const parsed = assistantQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Pregunta invalida", issues: parsed.error.flatten() }, { status: 400 });
  }

  const [profile, transactions, budgets, obligations, goals] = await Promise.all([
    prisma.profile.findUnique({ where: { userId: auth.user.id } }),
    prisma.transaction.findMany({ where: { userId: auth.user.id }, orderBy: { date: "desc" }, take: 200 }),
    prisma.budget.findMany({ where: { userId: auth.user.id } }),
    prisma.obligation.findMany({ where: { userId: auth.user.id } }),
    prisma.goal.findMany({ where: { userId: auth.user.id } }),
  ]);

  const answer = answerBudgetlyQuestion(parsed.data.question, {
    currency: profile?.currency ?? "ARS",
    transactions: transactions.map((transaction) => ({
      kind: transaction.kind as "income" | "expense",
      name: transaction.name,
      amount: Number(transaction.amount.toString()),
      category: transaction.category,
      date: transaction.date.toISOString().slice(0, 10),
    })),
    budgets: budgets.map((budget) => ({
      name: budget.name,
      category: budget.category,
      limitAmount: Number(budget.limitAmount.toString()),
    })),
    obligations: obligations.map((obligation) => ({
      name: obligation.name,
      amount: Number(obligation.amount.toString()),
      status: obligation.status,
      dueDay: obligation.dueDay,
    })),
    goals: goals.map((goal) => ({
      name: goal.name,
      targetAmount: Number(goal.targetAmount.toString()),
      currentAmount: Number(goal.currentAmount.toString()),
      status: goal.status,
    })),
  });

  await prisma.assistantMessage.createMany({
    data: [
      { userId: auth.user.id, role: "user", content: parsed.data.question },
      { userId: auth.user.id, role: "assistant", content: answer },
    ],
  });

  await createAuditLog({
    userId: auth.user.id,
    action: "ASSISTANT_MESSAGE_CREATED",
    entity: "assistant_message",
    metadata: { messages: 2 },
  });

  return NextResponse.json({ answer });
}

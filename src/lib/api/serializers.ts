import type {
  Budget,
  Goal,
  Invoice,
  Obligation,
  Profile,
  Routine,
  ScheduleBlock,
  Transaction,
} from "@prisma/client";

function money(value: { toString(): string } | number | null) {
  return value === null ? 0 : Number(value.toString());
}

function date(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

export function serializeProfile(profile: Profile) {
  return {
    ...profile,
    monthlyBudget: money(profile.monthlyBudget),
    weeklyBudget: money(profile.weeklyBudget),
    variableBudget: money(profile.variableBudget),
    monthlySavingsGoal: money(profile.monthlySavingsGoal),
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export function serializeTransaction(transaction: Transaction & { invoice?: Invoice | null }) {
  return {
    ...transaction,
    amount: money(transaction.amount),
    date: date(transaction.date),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
    invoice: transaction.invoice
      ? {
          ...transaction.invoice,
          amount: money(transaction.invoice.amount),
          date: date(transaction.invoice.date),
          createdAt: transaction.invoice.createdAt.toISOString(),
          updatedAt: transaction.invoice.updatedAt.toISOString(),
        }
      : null,
  };
}

export function serializeBudget(budget: Budget) {
  return {
    ...budget,
    limitAmount: money(budget.limitAmount),
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}

export function serializeObligation(obligation: Obligation) {
  return {
    ...obligation,
    amount: money(obligation.amount),
    createdAt: obligation.createdAt.toISOString(),
    updatedAt: obligation.updatedAt.toISOString(),
  };
}

export function serializeGoal(goal: Goal) {
  return {
    ...goal,
    targetAmount: money(goal.targetAmount),
    currentAmount: money(goal.currentAmount),
    autoPercentage: money(goal.autoPercentage),
    deadline: date(goal.deadline),
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

export function serializeScheduleBlock(block: ScheduleBlock) {
  return {
    ...block,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  };
}

export function serializeRoutine(routine: Routine) {
  return {
    ...routine,
    createdAt: routine.createdAt.toISOString(),
    updatedAt: routine.updatedAt.toISOString(),
  };
}

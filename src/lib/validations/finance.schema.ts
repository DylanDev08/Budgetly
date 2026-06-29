import { z } from "zod";

const moneySchema = z.coerce.number().finite().nonnegative().max(1_000_000_000);
const positiveMoneySchema = z.coerce.number().finite().positive().max(1_000_000_000);
const requiredTextSchema = z.string().trim().min(1).max(160);
const optionalTextSchema = z.string().trim().max(500).optional().nullable();
const isoDateSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeSchema = z.string().trim().regex(/^\d{2}:\d{2}$/);

export const idSchema = z.string().uuid();

export const transactionSchema = z.object({
  externalId: z.string().trim().max(160).optional().nullable(),
  kind: z.enum(["income", "expense"]),
  name: requiredTextSchema,
  amount: positiveMoneySchema,
  category: requiredTextSchema,
  type: z.enum(["fijo", "mensual", "semanal", "variable", "unico"]),
  source: z.enum(["manual", "mercado_pago"]).default("manual"),
  date: isoDateSchema,
  note: optionalTextSchema,
});

export const transactionUpdateSchema = transactionSchema.partial();

export const transactionImportSchema = z.object({
  transactions: z.array(transactionSchema).min(1).max(500),
});

export const budgetSchema = z.object({
  name: requiredTextSchema,
  category: z.string().trim().max(120).optional().nullable(),
  type: requiredTextSchema,
  limitAmount: positiveMoneySchema,
  alertPercentage: z.coerce.number().int().min(1).max(120).default(80),
});

export const budgetUpdateSchema = budgetSchema.partial();

export const obligationSchema = z.object({
  name: requiredTextSchema,
  amount: positiveMoneySchema,
  category: requiredTextSchema,
  frequency: requiredTextSchema,
  dueDay: z.coerce.number().int().min(1).max(31),
  status: z.enum(["pendiente", "pagado"]).default("pendiente"),
  autoCreateTransaction: z.coerce.boolean().default(false),
});

export const obligationUpdateSchema = obligationSchema.partial();

export const goalSchema = z.object({
  name: requiredTextSchema,
  targetAmount: positiveMoneySchema,
  currentAmount: moneySchema.default(0),
  deadline: isoDateSchema.optional().nullable(),
  priority: z.enum(["baja", "media", "alta"]).default("media"),
  autoEnabled: z.coerce.boolean().default(false),
  autoPercentage: z.coerce.number().finite().min(0).max(100).default(0),
  status: z.enum(["activa", "pausada", "completada"]).default("activa"),
});

export const goalUpdateSchema = goalSchema.partial();

export const scheduleBlockSchema = z.object({
  day: z.enum(["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]),
  startTime: timeSchema,
  endTime: timeSchema,
  activity: requiredTextSchema,
  area: z.enum(["trabajo", "estudio", "gym", "descanso", "finanzas", "otro"]),
});

export const scheduleBlockUpdateSchema = scheduleBlockSchema.partial();

export const routineSchema = z.object({
  name: requiredTextSchema,
  frequency: requiredTextSchema,
  done: z.coerce.boolean().default(false),
  streak: z.coerce.number().int().min(0).max(3650).default(0),
});

export const routineUpdateSchema = routineSchema.partial();

export const settingsSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  currency: z.enum(["ARS", "USD", "BRL", "EUR"]),
  alertMode: z.enum(["serio", "normal", "humoristico"]),
  riskProfile: z.enum(["conservador", "moderado", "agresivo"]),
  monthlyBudget: moneySchema,
  weeklyBudget: moneySchema,
  variableBudget: moneySchema,
  monthlySavingsGoal: moneySchema,
  theme: z.enum(["dark", "light"]).default("dark"),
});

export const assistantQuestionSchema = z.object({
  question: z.string().trim().min(2).max(500),
});

export const adminProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  role: z.enum(["user", "admin"]).optional(),
  plan: z.enum(["free", "premium", "pro"]).optional(),
  currency: z.enum(["ARS", "USD", "BRL", "EUR"]).optional(),
  alertMode: z.enum(["serio", "normal", "humoristico"]).optional(),
  riskProfile: z.enum(["conservador", "moderado", "agresivo"]).optional(),
  monthlyBudget: moneySchema.optional(),
  weeklyBudget: moneySchema.optional(),
  variableBudget: moneySchema.optional(),
  monthlySavingsGoal: moneySchema.optional(),
  theme: z.enum(["dark", "light"]).optional(),
});

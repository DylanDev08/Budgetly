import { z } from "zod";

export const adminPlanSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.enum(["free", "premium", "pro"]),
  price: z.coerce.number().finite().nonnegative().max(1_000_000_000),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  interval: z.enum(["monthly", "yearly"]).default("monthly"),
  features: z.array(z.string().trim().min(2).max(80)).default([]),
  active: z.coerce.boolean().default(true),
});

export const adminPlanUpdateSchema = adminPlanSchema.partial();

export const adminFeatureFlagSchema = z.object({
  key: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(300).optional().nullable(),
  minimumPlan: z.enum(["free", "premium", "pro"]).default("free"),
  active: z.coerce.boolean().default(true),
});

export const adminFeatureFlagUpdateSchema = adminFeatureFlagSchema.partial();

export const adminClientNoteSchema = z.object({
  title: z.string().trim().min(2).max(120),
  content: z.string().trim().min(2).max(1200),
});

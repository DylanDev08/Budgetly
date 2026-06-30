import { z } from "zod";

export const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;
export const maxUploadBytes = 5 * 1024 * 1024;

export const uploadKindSchema = z.enum(["avatar", "assistant_image", "receipt"]);

export const extractionConfirmSchema = z.object({
  extractionId: z.string().uuid(),
  amount: z.coerce.number().finite().positive().max(1_000_000_000),
  currency: z.enum(["ARS", "USD"]).default("ARS"),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  merchant: z.string().trim().max(160).optional().nullable(),
  concept: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(160),
  kind: z.enum(["income", "expense"]),
  type: z.enum(["fijo", "mensual", "semanal", "variable", "unico"]).default("variable"),
});

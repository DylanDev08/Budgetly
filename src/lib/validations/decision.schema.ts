import { z } from "zod";

export const decisionSimulationSchema = z.object({
  title: z.string().trim().min(2).max(160),
  type: z.enum(["purchase", "save", "pay_obligation", "invest"]),
  amount: z.coerce.number().finite().positive().max(1_000_000_000),
});

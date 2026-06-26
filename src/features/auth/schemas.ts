import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un email valido").max(255),
  password: z.string().min(8, "La clave debe tener al menos 8 caracteres").max(128),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Ingresa tu nombre").max(120),
  acceptedTerms: z.boolean().refine((value) => value, {
    message: "Debes aceptar los terminos y condiciones",
  }),
  connectMercadoPago: z.boolean(),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

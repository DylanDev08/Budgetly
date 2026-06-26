"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterValues } from "@/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      acceptedTerms: false,
      connectMercadoPago: false,
    },
  });

  async function onSubmit(values: RegisterValues) {
    setFormError(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!response.ok) {
      setFormError(result.error ?? "No se pudo crear la cuenta.");
      return;
    }

    router.push(result.redirectTo ?? "/dashboard");
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <CardHeader>
        <CardTitle>Crear cuenta en Budgetly</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Nombre" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Clave"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <label className="flex items-start gap-3 rounded-lg border border-budget-border p-3 text-sm text-budget-muted">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-budget-border text-budget-green"
              {...register("acceptedTerms")}
            />
            <span>
              Acepto los{" "}
              <Link href="/legal/terms" className="font-semibold text-budget-dark hover:text-budget-green">
                terminos y condiciones legales
              </Link>
              .
              {errors.acceptedTerms?.message ? (
                <span className="mt-1 block font-medium text-red-600">{errors.acceptedTerms.message}</span>
              ) : null}
            </span>
          </label>

          {formError ? <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{formError}</p> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="submit" disabled={isSubmitting} onClick={() => setValue("connectMercadoPago", false)}>
              {isSubmitting ? "Creando..." : "Crear cuenta"}
            </Button>
            <Button
              type="submit"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => setValue("connectMercadoPago", true)}
            >
              <CreditCard className="h-4 w-4" />
              Crear y conectar MP
            </Button>
          </div>

          <p className="text-sm text-budget-muted">
            Ya tenes cuenta?{" "}
            <Link href="/auth/login" className="font-semibold text-budget-dark hover:text-budget-green">
              Ingresar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

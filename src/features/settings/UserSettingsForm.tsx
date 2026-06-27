"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type SettingsValues = {
  fullName: string;
  email: string;
  currency: string;
  alertMode: string;
  riskProfile: string;
  monthlyBudget: string;
  weeklyBudget: string;
  variableBudget: string;
  monthlySavingsGoal: string;
  theme: string;
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo guardar.");
  }

  return result;
}

function mapSettings(item: Record<string, string | number>): SettingsValues {
  return {
    fullName: String(item.fullName ?? ""),
    email: String(item.email ?? ""),
    currency: String(item.currency ?? "ARS"),
    alertMode: String(item.alertMode ?? "normal"),
    riskProfile: String(item.riskProfile ?? "conservador"),
    monthlyBudget: String(item.monthlyBudget ?? 0),
    weeklyBudget: String(item.weeklyBudget ?? 0),
    variableBudget: String(item.variableBudget ?? 0),
    monthlySavingsGoal: String(item.monthlySavingsGoal ?? 0),
    theme: String(item.theme ?? "dark"),
  };
}

function SettingsFormBody({ initialValues }: { initialValues: SettingsValues }) {
  const [values, setValues] = useState<SettingsValues>(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: () =>
      apiJson("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          monthlyBudget: Number(values.monthlyBudget),
          weeklyBudget: Number(values.weeklyBudget),
          variableBudget: Number(values.variableBudget),
          monthlySavingsGoal: Number(values.monthlySavingsGoal),
        }),
      }),
    onSuccess: () => setMessage("Ajustes guardados."),
    onError: (error) => setMessage(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <form className="grid gap-5 p-5 sm:p-8 xl:grid-cols-[1fr_0.8fr]" onSubmit={submit}>
      <Card>
        <CardHeader>
          <CardTitle>Perfil y preferencias</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input label="Nombre" value={values.fullName} onChange={(event) => setValues((current) => ({ ...current, fullName: event.target.value }))} required />
          <Input label="Email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} required />
          <Select label="Moneda principal" value={values.currency} onChange={(event) => setValues((current) => ({ ...current, currency: event.target.value }))}>
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
            <option value="EUR">EUR</option>
          </Select>
          <Select label="Modo de alerta" value={values.alertMode} onChange={(event) => setValues((current) => ({ ...current, alertMode: event.target.value }))}>
            <option value="serio">Serio</option>
            <option value="normal">Normal</option>
            <option value="humoristico">Humoristico/directo</option>
          </Select>
          <Select label="Perfil de riesgo" value={values.riskProfile} onChange={(event) => setValues((current) => ({ ...current, riskProfile: event.target.value }))}>
            <option value="conservador">Conservador</option>
            <option value="moderado">Moderado</option>
            <option value="agresivo">Agresivo</option>
          </Select>
          <Select label="Tema visual" value={values.theme} onChange={(event) => setValues((current) => ({ ...current, theme: event.target.value }))}>
            <option value="dark">Oscuro</option>
            <option value="light">Claro futuro</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites financieros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input label="Presupuesto mensual general" type="number" min="0" value={values.monthlyBudget} onChange={(event) => setValues((current) => ({ ...current, monthlyBudget: event.target.value }))} />
          <Input label="Limite semanal" type="number" min="0" value={values.weeklyBudget} onChange={(event) => setValues((current) => ({ ...current, weeklyBudget: event.target.value }))} />
          <Input label="Limite de gastos variables" type="number" min="0" value={values.variableBudget} onChange={(event) => setValues((current) => ({ ...current, variableBudget: event.target.value }))} />
          <Input label="Meta de ahorro mensual" type="number" min="0" value={values.monthlySavingsGoal} onChange={(event) => setValues((current) => ({ ...current, monthlySavingsGoal: event.target.value }))} />
          <div className="flex items-center justify-between rounded-lg border border-budget-border p-3">
            <span className="text-sm font-medium text-budget-text">Mercado Pago</span>
            <Badge tone="warning">Validar en seccion MP</Badge>
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            <Save className="h-4 w-4" />
            {mutation.isPending ? "Guardando..." : "Guardar ajustes"}
          </Button>
          {message ? <p className="text-sm font-medium text-budget-muted">{message}</p> : null}
        </CardContent>
      </Card>
    </form>
  );
}

export function UserSettingsForm() {
  const query = useQuery<{ item: Record<string, string | number> }>({
    queryKey: ["/api/settings"],
    queryFn: () => apiJson("/api/settings"),
  });

  if (query.isLoading) {
    return <p className="p-5 text-sm text-budget-muted sm:p-8">Cargando ajustes...</p>;
  }

  if (query.isError) {
    return <p className="p-5 text-sm text-red-300 sm:p-8">{query.error.message}</p>;
  }

  return <SettingsFormBody key={String(query.data?.item.id ?? "settings")} initialValues={mapSettings(query.data?.item ?? {})} />;
}

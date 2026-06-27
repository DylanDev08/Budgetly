"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Profile = {
  id: string;
  userId: string;
  fullName: string | null;
  email: string;
  currency: string;
  alertMode: string;
  riskProfile: string;
  monthlyBudget: number;
  weeklyBudget: number;
  variableBudget: number;
  monthlySavingsGoal: number;
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo completar la operacion.");
  }

  return result;
}

export function AdminProfilesPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Profile | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const query = useQuery<{ items: Profile[] }>({
    queryKey: ["/api/admin/profiles"],
    queryFn: () => apiJson("/api/admin/profiles"),
  });

  const mutation = useMutation({
    mutationFn: (profile: Profile) =>
      apiJson(`/api/admin/profiles/${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.fullName,
          currency: profile.currency,
          alertMode: profile.alertMode,
          riskProfile: profile.riskProfile,
          monthlyBudget: profile.monthlyBudget,
          weeklyBudget: profile.weeklyBudget,
          variableBudget: profile.variableBudget,
          monthlySavingsGoal: profile.monthlySavingsGoal,
        }),
      }),
    onSuccess: async () => {
      setEditing(null);
      setMessage("Perfil actualizado.");
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/profiles"] });
    },
    onError: (error) => setMessage(error.message),
  });

  return (
    <div className="grid gap-5 p-5 sm:p-8">
      {message ? <p className="rounded-lg border border-budget-border bg-budget-card p-3 text-sm text-budget-muted">{message}</p> : null}
      {query.isLoading ? <p className="text-sm text-budget-muted">Cargando perfiles...</p> : null}
      {query.isError ? <p className="text-sm text-red-300">{query.error.message}</p> : null}
      <div className="grid gap-4">
        {query.data?.items.map((profile) => {
          const current = editing?.id === profile.id ? editing : profile;

          return (
            <Card key={profile.id}>
              <CardHeader>
                <CardTitle>{profile.email}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Input label="Nombre" value={current.fullName ?? ""} onChange={(event) => setEditing({ ...current, fullName: event.target.value })} />
                <Select label="Moneda" value={current.currency} onChange={(event) => setEditing({ ...current, currency: event.target.value })}>
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="BRL">BRL</option>
                  <option value="EUR">EUR</option>
                </Select>
                <Select label="Alerta" value={current.alertMode} onChange={(event) => setEditing({ ...current, alertMode: event.target.value })}>
                  <option value="serio">Serio</option>
                  <option value="normal">Normal</option>
                  <option value="humoristico">Humoristico</option>
                </Select>
                <Select label="Riesgo" value={current.riskProfile} onChange={(event) => setEditing({ ...current, riskProfile: event.target.value })}>
                  <option value="conservador">Conservador</option>
                  <option value="moderado">Moderado</option>
                  <option value="agresivo">Agresivo</option>
                </Select>
                <Input label="Presupuesto mensual" type="number" value={String(current.monthlyBudget)} onChange={(event) => setEditing({ ...current, monthlyBudget: Number(event.target.value) })} />
                <Input label="Limite semanal" type="number" value={String(current.weeklyBudget)} onChange={(event) => setEditing({ ...current, weeklyBudget: Number(event.target.value) })} />
                <Input label="Variable" type="number" value={String(current.variableBudget)} onChange={(event) => setEditing({ ...current, variableBudget: Number(event.target.value) })} />
                <Input label="Ahorro mensual" type="number" value={String(current.monthlySavingsGoal)} onChange={(event) => setEditing({ ...current, monthlySavingsGoal: Number(event.target.value) })} />
                <div className="md:col-span-2 xl:col-span-4">
                  <Button type="button" disabled={!editing || editing.id !== profile.id || mutation.isPending} onClick={() => mutation.mutate(current)}>
                    <Save className="h-4 w-4" />
                    Guardar perfil
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

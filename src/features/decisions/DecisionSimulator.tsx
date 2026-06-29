"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type DecisionResult = {
  canProceed: boolean;
  projectedBalance: number;
  riskLevel: string;
  recommendation: string;
  educationalDisclaimer: string;
  alerts: { level: string; message: string }[];
};

type SimulationHistory = {
  id: string;
  title: string;
  type: string;
  amount: number;
  createdAt: string;
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo completar la simulacion.");
  }

  return result;
}

export function DecisionSimulator() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("Comprar notebook");
  const [type, setType] = useState("purchase");
  const [amount, setAmount] = useState("100000");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const historyQuery = useQuery<{ success: boolean; data: { items: SimulationHistory[] } }>({
    queryKey: ["/api/decisions"],
    queryFn: () => apiJson("/api/decisions"),
  });

  const mutation = useMutation({
    mutationFn: () =>
      apiJson<{ success: boolean; data: { result: DecisionResult } }>("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, amount: Number(amount) }),
      }),
    onSuccess: async (data) => {
      setResult(data.data.result);
      setMessage(null);
      await queryClient.invalidateQueries({ queryKey: ["/api/decisions"] });
    },
    onError: (error) => setMessage(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>Nueva simulacion</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            <Input label="Titulo" value={title} onChange={(event) => setTitle(event.target.value)} required />
            <Select label="Escenario" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="purchase">Si compro esto</option>
              <option value="save">Si ahorro esto</option>
              <option value="pay_obligation">Si pago esta obligacion</option>
              <option value="invest">Si invierto este monto</option>
            </Select>
            <Input label="Monto" type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
            <Button type="submit" disabled={mutation.isPending}>
              <Send className="h-4 w-4" />
              {mutation.isPending ? "Simulando..." : "Simular decision"}
            </Button>
            {message ? <p className="text-sm text-red-300">{message}</p> : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Resultado educativo</CardTitle>
              {result ? <Badge tone={result.canProceed ? "success" : "warning"}>{result.canProceed ? "posible" : "revisar"}</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="grid gap-4">
                <p className="text-sm leading-6 text-budget-muted">{result.recommendation}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-budget-border bg-budget-surface p-3">
                    <p className="text-xs text-budget-muted">Balance proyectado</p>
                    <p className="mt-1 text-lg font-semibold text-budget-text">{result.projectedBalance.toLocaleString("es-AR")}</p>
                  </div>
                  <div className="rounded-lg border border-budget-border bg-budget-surface p-3">
                    <p className="text-xs text-budget-muted">Riesgo</p>
                    <p className="mt-1 text-lg font-semibold text-budget-text">{result.riskLevel}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {result.alerts.map((alert) => (
                    <p key={alert.message} className="rounded-lg border border-budget-border bg-budget-surface p-3 text-sm text-budget-muted">
                      {alert.message}
                    </p>
                  ))}
                </div>
                <p className="text-xs leading-5 text-budget-dim">{result.educationalDisclaimer}</p>
              </div>
            ) : (
              <p className="text-sm leading-6 text-budget-muted">Completa una simulacion para comparar impacto, riesgo y alertas.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial reciente</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {historyQuery.data?.data.items.length ? (
              historyQuery.data.data.items.map((item) => (
                <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-3">
                  <p className="font-semibold text-budget-text">{item.title}</p>
                  <p className="mt-1 text-sm text-budget-muted">
                    {item.type} / {item.amount.toLocaleString("es-AR")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-budget-muted">Todavia no hay simulaciones guardadas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

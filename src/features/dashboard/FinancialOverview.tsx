"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Landmark, Receipt, Target, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CommandCard } from "@/components/ui/CommandCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Progress } from "@/components/ui/Progress";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StatCard } from "@/components/ui/StatCard";
import { StatTrend } from "@/components/ui/StatTrend";

type DashboardSummary = {
  currency: string;
  income: number;
  expense: number;
  balance: number;
  weeklyExpense: number;
  budgetUsed: number;
  health: "bien" | "advertencia" | "critico";
  pulse: {
    score: number;
    status: string;
    factors: Record<string, number>;
  };
  nextBestAction: {
    title: string;
    description: string;
    href: string;
  };
  plan: string;
  topCategory: { name: string; amount: number } | null;
  recentTransactions: { id: string; name: string; kind: string; amount: number; date: string }[];
  obligations: { id: string; name: string; amount: number; dueDay: number }[];
  goals: { id: string; name: string; targetAmount: number; currentAmount: number }[];
  invoices: { id: string; invoiceNumber: string; concept: string; amount: number }[];
  mercadoPagoConnected: boolean;
};

async function loadSummary() {
  const response = await fetch("/api/dashboard/summary");
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el dashboard.");
  }

  return result as DashboardSummary;
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function FinancialOverview() {
  const query = useQuery({ queryKey: ["/api/dashboard/summary"], queryFn: loadSummary });
  const data = query.data;

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando dashboard...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-budget-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Budgetly Pulse Score</CardTitle>
              <Badge tone={data.pulse.score >= 75 ? "success" : data.pulse.score >= 55 ? "warning" : "danger"}>
                {data.pulse.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
            <ProgressRing value={data.pulse.score} label="Pulse" />
            <div className="grid gap-3 sm:grid-cols-2">
              <StatTrend label="Control de gastos" value={`${data.pulse.factors.expenseControl}%`} tone={data.pulse.factors.expenseControl >= 70 ? "good" : "warning"} />
              <StatTrend label="Obligaciones" value={`${data.pulse.factors.obligationCompliance}%`} tone={data.pulse.factors.obligationCompliance >= 70 ? "good" : "warning"} />
              <StatTrend label="Metas" value={`${data.pulse.factors.goalProgress}%`} />
              <StatTrend label="Ahorro" value={`${data.pulse.factors.savingsLevel}%`} />
            </div>
          </CardContent>
        </Card>
        <CommandCard title={data.nextBestAction.title} description={data.nextBestAction.description} href={data.nextBestAction.href} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ingresos del mes" value={money(data.income, data.currency)} helper="Movimientos cargados" icon={ArrowUpCircle} />
        <StatCard title="Gastos del mes" value={money(data.expense, data.currency)} helper="Egresos registrados" icon={ArrowDownCircle} />
        <StatCard title="Balance actual" value={money(data.balance, data.currency)} helper="Ingresos menos gastos" icon={Wallet} />
        <StatCard title="Gastos de la semana" value={money(data.weeklyExpense, data.currency)} helper="Desde inicio de semana" icon={Landmark} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Uso de presupuesto</CardTitle>
              <Badge tone={data.budgetUsed >= 100 ? "danger" : data.budgetUsed >= 80 ? "warning" : "success"}>
                {data.budgetUsed}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-budget-muted">Presupuesto mensual usado</span>
                <span className="font-semibold text-budget-text">{data.budgetUsed}%</span>
              </div>
              <Progress value={Math.min(data.budgetUsed, 100)} />
              <p className="text-sm leading-6 text-budget-muted">
                Alertas por 80%, 100% y 120%. Configura el presupuesto mensual en Ajustes o Presupuestos.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-300">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-budget-text">{data.health}</p>
                <p className="mt-2 text-sm leading-6 text-budget-muted">
                  Mercado Pago: {data.mercadoPagoConnected ? "conectado" : "no conectado"}. Categoria top:{" "}
                  {data.topCategory ? `${data.topCategory.name} (${money(data.topCategory.amount, data.currency)})` : "sin gastos"}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {data.recentTransactions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Ultimos movimientos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {data.recentTransactions.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface p-3">
                  <span className="text-sm font-medium text-budget-text">{item.name}</span>
                  <span className="text-sm text-budget-muted">{money(item.amount, data.currency)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <EmptyState icon={ArrowDownCircle} title="Sin movimientos recientes" description="Carga movimientos manuales o sincroniza Mercado Pago." />
        )}
        <div className="grid gap-5">
          <EmptyState icon={Receipt} title={`${data.obligations.length} obligaciones pendientes`} description="Las obligaciones pendientes se listan en su modulo." />
          <EmptyState icon={Target} title={`${data.goals.length} metas activas`} description="El progreso detallado vive en Metas." />
        </div>
      </div>
    </div>
  );
}

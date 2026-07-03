"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowDownCircle, ArrowRight, ArrowUpCircle, Landmark, Receipt, Target, Wallet, type LucideIcon } from "lucide-react";
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
  pulse?: {
    score: number;
    status: string;
    factors: Record<string, number>;
  };
  nextBestAction?: {
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

  const pulse = data.pulse ?? {
    score: 50,
    status: "Inicial",
    factors: {
      expenseControl: 50,
      obligationCompliance: 50,
      goalProgress: 50,
      savingsLevel: 50,
    },
  };
  const nextBestAction = data.nextBestAction ?? {
    title: "Carga tus primeros datos",
    description: "Budgetly necesita movimientos, presupuestos y metas para darte una lectura real.",
    href: "/movements",
  };
  const flowTotal = Math.max(data.income + data.expense, 1);
  const incomeWidth = Math.round((data.income / flowTotal) * 100);
  const expenseWidth = Math.max(0, 100 - incomeWidth);

  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ingresos del mes" value={money(data.income, data.currency)} helper="Movimientos cargados" icon={ArrowUpCircle} />
        <StatCard title="Gastos del mes" value={money(data.expense, data.currency)} helper="Egresos registrados" icon={ArrowDownCircle} />
        <StatCard title="Balance actual" value={money(data.balance, data.currency)} helper="Ingresos menos gastos" icon={Wallet} />
        <StatCard title="Gastos de la semana" value={money(data.weeklyExpense, data.currency)} helper="Desde inicio de semana" icon={Landmark} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-budget-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Budgetly Pulse Score</CardTitle>
              <Badge tone={pulse.score >= 75 ? "success" : pulse.score >= 55 ? "warning" : "danger"}>
                {pulse.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
            <ProgressRing value={pulse.score} label="Pulse" />
            <div className="grid gap-3 sm:grid-cols-2">
              <StatTrend label="Control de gastos" value={`${pulse.factors.expenseControl ?? 50}%`} tone={(pulse.factors.expenseControl ?? 50) >= 70 ? "good" : "warning"} />
              <StatTrend label="Obligaciones" value={`${pulse.factors.obligationCompliance ?? 50}%`} tone={(pulse.factors.obligationCompliance ?? 50) >= 70 ? "good" : "warning"} />
              <StatTrend label="Metas" value={`${pulse.factors.goalProgress ?? 50}%`} />
              <StatTrend label="Ahorro" value={`${pulse.factors.savingsLevel ?? 50}%`} />
            </div>
          </CardContent>
        </Card>
        <CommandCard title={nextBestAction.title} description={nextBestAction.description} href={nextBestAction.href} />
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
              <div className="pt-3">
                <div className="mb-2 flex items-center justify-between text-xs text-budget-dim">
                  <span>Estado del mes</span>
                  <span>{money(data.income + data.expense, data.currency)} movidos</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-budget-surface">
                  <span className="bg-budget-green" style={{ width: `${incomeWidth}%` }} />
                  <span className="bg-red-500" style={{ width: `${expenseWidth}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-budget-muted">
                  <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-budget-green" />Ingresos {incomeWidth}%</span>
                  <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />Gastos {expenseWidth}%</span>
                </div>
              </div>
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

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Actividad cotidiana</CardTitle>
              <Badge tone={data.recentTransactions.length > 0 ? "success" : "neutral"}>{data.recentTransactions.length} recientes</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.recentTransactions.length === 0 ? (
              <EmptyState icon={ArrowDownCircle} title="Sin movimientos recientes" description="Carga movimientos manuales o sincroniza Mercado Pago." />
            ) : null}
            {data.recentTransactions.map((item) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-budget-border bg-budget-surface p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-budget-text">{item.name}</p>
                    <Badge tone={item.kind === "income" ? "success" : "danger"}>{item.kind === "income" ? "ingreso" : "egreso"}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-budget-dim">{item.date}</p>
                </div>
                <p className={`text-sm font-semibold ${item.kind === "income" ? "text-budget-neon" : "text-red-300"}`}>
                  {money(item.amount, data.currency)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda de dinero</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <DashboardQueue
              icon={Receipt}
              title={`${data.obligations.length} obligaciones pendientes`}
              items={data.obligations.map((item) => `${item.name} / vence dia ${item.dueDay} / ${money(item.amount, data.currency)}`)}
            />
            <DashboardQueue
              icon={Target}
              title={`${data.goals.length} metas activas`}
              items={data.goals.map((item) => `${item.name} / ${money(item.currentAmount, data.currency)} de ${money(item.targetAmount, data.currency)}`)}
            />
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <div className="flex items-start gap-3">
                <ArrowRight className="mt-0.5 h-4 w-4 text-budget-neon" />
                <p className="text-sm leading-6 text-budget-muted">
                  Mercado Pago esta {data.mercadoPagoConnected ? "conectado" : "pendiente"} y los comprobantes recientes son {data.invoices.length}.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardQueue({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-semibold text-budget-text">{title}</p>
      </div>
      <div className="mt-3 grid gap-2">
        {items.length === 0 ? <p className="text-sm text-budget-muted">Sin registros pendientes.</p> : null}
        {items.slice(0, 4).map((item) => (
          <p key={item} className="rounded-lg border border-budget-border bg-budget-card px-3 py-2 text-sm text-budget-muted">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  Gauge,
  Lock,
  Receipt,
  ShieldCheck,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatMoney } from "@/lib/utils/money";

type Overview = {
  metrics: {
    clients: number;
    transactions: number;
    monthlyIncome: number;
    monthlyExpense: number;
    monthlyBalance: number;
    pendingObligations: number;
    uploads: number;
    extractions: number;
    mercadoPagoAccounts: number;
  };
  sourceCounts: Record<string, number>;
  planCounts: Record<string, number>;
  recentClients: {
    userId: string;
    userLabel: string;
    fullName: string;
    email: string;
    plan: string;
    status: string;
    role: string;
    lastLoginAt: string | null;
    createdAt: string;
  }[];
  recentActivity: {
    id: string;
    userLabel: string;
    action: string;
    entity: string;
    createdAt: string;
  }[];
  security: {
    supabase: boolean;
    database: boolean;
    rlsMode: string;
    sensitiveTables: string;
    exposedCredentials: boolean;
  };
};

async function loadOverview() {
  const response = await fetch("/api/admin/overview");
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el dashboard admin.");
  }

  return result.data as Overview;
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Sin acceso";
}

export function AdminDashboardOverview() {
  const query = useQuery({ queryKey: ["/api/admin/overview"], queryFn: loadOverview });
  const data = query.data;

  if (query.isLoading) {
    return <p className="p-5 text-sm text-budget-muted sm:p-8">Cargando dashboard admin...</p>;
  }

  if (query.isError) {
    return <p className="m-5 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 sm:m-8">{query.error.message}</p>;
  }

  if (!data) return null;

  const balanceTone = data.metrics.monthlyBalance >= 0 ? "text-budget-neon" : "text-red-300";
  const sourceEntries = Object.entries(data.sourceCounts);
  const planEntries = Object.entries(data.planCounts);

  return (
    <main className="grid gap-5 p-5 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Kpi icon={Users} label="Clientes" value={data.metrics.clients} href="/admin/clients" />
        <Kpi icon={WalletCards} label="Movimientos" value={data.metrics.transactions} href="/admin/transactions" />
        <Kpi icon={Receipt} label="Obligaciones pendientes" value={data.metrics.pendingObligations} href="/admin/clients" />
        <Kpi icon={FileText} label="Archivos procesados" value={data.metrics.uploads + data.metrics.extractions} href="/admin/uploads" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Centro operativo</CardTitle>
              <p className="mt-1 text-sm text-budget-muted">Lectura mensual de actividad financiera global.</p>
            </div>
            <Link
              href="/admin/transactions"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-budget-border bg-budget-card px-4 text-sm font-semibold text-budget-text transition hover:bg-budget-hover"
            >
              Ver movimientos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <MetricBlock label="Ingresos del mes" value={formatMoney(data.metrics.monthlyIncome)} tone="positive" />
            <MetricBlock label="Egresos del mes" value={formatMoney(data.metrics.monthlyExpense)} tone="negative" />
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <p className="text-sm text-budget-muted">Balance mensual</p>
              <p className={`mt-2 text-2xl font-semibold ${balanceTone}`}>{formatMoney(data.metrics.monthlyBalance)}</p>
              <p className="mt-3 text-xs text-budget-dim">Calculado sobre movimientos del mes actual.</p>
            </div>
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4 lg:col-span-2">
              <p className="font-semibold text-budget-text">Origen de movimientos</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {sourceEntries.length === 0 ? <p className="text-sm text-budget-muted">Sin movimientos este mes.</p> : null}
                {sourceEntries.map(([source, count]) => (
                  <div key={source} className="rounded-lg border border-budget-border bg-budget-card p-3">
                    <p className="text-xs uppercase tracking-wide text-budget-dim">{source}</p>
                    <p className="mt-2 text-xl font-semibold text-budget-text">{count}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <p className="font-semibold text-budget-text">Planes</p>
              <div className="mt-4 grid gap-2">
                {planEntries.length === 0 ? <p className="text-sm text-budget-muted">Sin perfiles.</p> : null}
                {planEntries.map(([plan, count]) => (
                  <div key={plan} className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-card px-3 py-2 text-sm">
                    <span className="text-budget-muted">{plan}</span>
                    <span className="font-semibold text-budget-text">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacidad y RLS</CardTitle>
            <p className="mt-1 text-sm text-budget-muted">Estado de exposicion de datos sensibles.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            <SecurityRow label="Supabase env" ok={data.security.supabase} />
            <SecurityRow label="Database env" ok={data.security.database} />
            <SecurityRow label="RLS owner-only" ok={data.security.rlsMode === "owner_only"} />
            <SecurityRow label="Credenciales ocultas" ok={!data.security.exposedCredentials} />
            <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-4 w-4 text-budget-neon" />
                <p className="text-sm leading-6 text-budget-muted">
                  Emails enmascarados en admin, tokens de Mercado Pago fuera de respuesta y tablas sensibles solo por backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Clientes recientes</CardTitle>
              <p className="mt-1 text-sm text-budget-muted">Vista rapida con datos personales enmascarados.</p>
            </div>
            <Link href="/admin/clients" className="text-sm font-semibold text-budget-neon hover:text-budget-green">
              Abrir clientes
            </Link>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.recentClients.map((client) => (
              <Link
                key={client.userId}
                href={`/admin/clients/${client.userId}`}
                className="grid gap-3 rounded-lg border border-budget-border bg-budget-surface p-4 transition hover:border-budget-green/60 hover:bg-budget-hover sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-budget-text">{client.fullName}</p>
                  <p className="mt-1 text-sm text-budget-muted">{client.email}</p>
                  <p className="mt-1 text-xs text-budget-dim">ID: {client.userLabel} / Ultimo acceso: {formatDate(client.lastLoginAt)}</p>
                </div>
                <div className="flex flex-wrap items-start gap-2 sm:justify-end">
                  <Badge tone={client.status === "active" ? "success" : "neutral"}>{client.status}</Badge>
                  <Badge tone={client.plan === "free" ? "neutral" : "success"}>{client.plan}</Badge>
                  <Badge>{client.role}</Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <p className="mt-1 text-sm text-budget-muted">Auditoria operacional del panel.</p>
          </CardHeader>
          <CardContent className="grid gap-3">
            {data.recentActivity.length === 0 ? <p className="text-sm text-budget-muted">Sin actividad reciente.</p> : null}
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-budget-text">{activity.action}</p>
                    <p className="mt-1 text-sm text-budget-muted">{activity.entity} / {activity.userLabel}</p>
                  </div>
                  <Badge>{formatDate(activity.createdAt)}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-lg border border-budget-border bg-budget-card p-5 shadow-soft transition hover:border-budget-green/60 hover:bg-budget-hover">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
          <Icon className="h-4 w-4" />
        </div>
        <ArrowRight className="h-4 w-4 text-budget-dim" />
      </div>
      <p className="mt-4 text-sm text-budget-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-budget-text">{value}</p>
    </Link>
  );
}

function MetricBlock({ label, value, tone }: { label: string; value: string; tone: "positive" | "negative" }) {
  return (
    <div className="rounded-lg border border-budget-border bg-budget-surface p-4">
      <p className="text-sm text-budget-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone === "positive" ? "text-budget-neon" : "text-red-300"}`}>{value}</p>
    </div>
  );
}

function SecurityRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface px-4 py-3">
      <div className="flex items-center gap-3">
        {ok ? <ShieldCheck className="h-4 w-4 text-budget-neon" /> : <Gauge className="h-4 w-4 text-amber-300" />}
        <span className="text-sm font-medium text-budget-text">{label}</span>
      </div>
      <Badge tone={ok ? "success" : "warning"}>{ok ? "ok" : "revisar"}</Badge>
    </div>
  );
}

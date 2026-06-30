"use client";

import Link from "next/link";
import type { TdHTMLAttributes, ThHTMLAttributes } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle,
  Receipt,
  Search,
  Settings,
  User,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatMoney } from "@/lib/utils/money";

type TransactionItem = {
  id: string;
  userId: string;
  kind: "income" | "expense" | string;
  name: string;
  amount: number;
  category: string;
  type: string;
  source: string;
  date: string | null;
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
  } | null;
  customer?: {
    userId: string;
    userLabel: string;
    fullName: string;
    email: string;
    plan: string;
    status: string;
  };
};

async function loadTransactions() {
  const response = await fetch("/api/admin/transactions");
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudieron cargar los movimientos.");
  }

  return result.data.items as TransactionItem[];
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("es-AR", { dateStyle: "short" }).format(new Date(value)) : "Sin fecha";
}

export function AdminOperationsPanel() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("all");
  const [source, setSource] = useState("all");
  const query = useQuery({ queryKey: ["/api/admin/transactions"], queryFn: loadTransactions });

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return (query.data ?? []).filter((item) => {
      const customerText = `${item.customer?.fullName ?? ""} ${item.customer?.email ?? ""} ${item.customer?.userLabel ?? ""}`;
      const searchable = `${item.name} ${item.category} ${item.type} ${item.source} ${customerText}`.toLowerCase();
      const matchesSearch = normalizedSearch ? searchable.includes(normalizedSearch) : true;
      const matchesKind = kind === "all" ? true : item.kind === kind;
      const matchesSource = source === "all" ? true : item.source === source;

      return matchesSearch && matchesKind && matchesSource;
    });
  }, [kind, query.data, search, source]);

  const totals = useMemo(() => {
    const income = filtered.filter((item) => item.kind === "income").reduce((acc, item) => acc + item.amount, 0);
    const expense = filtered.filter((item) => item.kind === "expense").reduce((acc, item) => acc + item.amount, 0);
    const invoiceCount = filtered.filter((item) => item.invoice).length;
    const mercadoPago = filtered.filter((item) => item.source === "mercado_pago").length;

    return {
      income,
      expense,
      balance: income - expense,
      invoiceCount,
      mercadoPago,
      manual: filtered.length - mercadoPago,
    };
  }, [filtered]);

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando movimientos...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OperationMetric icon={WalletCards} label="Ingresos filtrados" value={formatMoney(totals.income)} tone="positive" />
        <OperationMetric icon={ArrowLeftRight} label="Egresos filtrados" value={formatMoney(totals.expense)} tone="negative" />
        <OperationMetric icon={Receipt} label="Con comprobante" value={totals.invoiceCount} tone="neutral" />
        <OperationMetric icon={CheckCircle} label="Mercado Pago" value={totals.mercadoPago} tone="positive" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <Card>
          <CardHeader>
            <div className="grid gap-4 xl:grid-cols-[1fr_auto] xl:items-center">
              <div>
                <CardTitle>Movimientos globales</CardTitle>
                <p className="mt-1 text-sm text-budget-muted">Operacion financiera global con datos personales enmascarados.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterSelect
                  value={kind}
                  onChange={setKind}
                  options={[
                    { value: "all", label: "Todos" },
                    { value: "income", label: "Ingresos" },
                    { value: "expense", label: "Egresos" },
                  ]}
                />
                <FilterSelect
                  value={source}
                  onChange={setSource}
                  options={[
                    { value: "all", label: "Origen" },
                    { value: "manual", label: "Manual" },
                    { value: "mercado_pago", label: "Mercado Pago" },
                  ]}
                />
              </div>
            </div>
            <label className="relative mt-4 block">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-budget-dim" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por cliente, categoria, tipo, origen o concepto"
                className="h-10 w-full rounded-lg border border-budget-border bg-budget-surface pl-10 pr-3 text-sm text-budget-text outline-none transition placeholder:text-budget-dim focus:border-budget-green focus:ring-2 focus:ring-budget-green/20"
              />
            </label>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-budget-surface text-xs uppercase tracking-wide text-budget-dim">
                  <tr>
                    <Th>Cliente</Th>
                    <Th>Movimiento</Th>
                    <Th>Categoria</Th>
                    <Th>Fecha</Th>
                    <Th>Origen</Th>
                    <Th>Estado</Th>
                    <Th className="text-right">Monto</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-sm text-budget-muted">
                        No hay movimientos para esos filtros.
                      </td>
                    </tr>
                  ) : null}
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-t border-budget-border">
                      <Td>
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-budget-text">{item.customer?.fullName ?? "Cliente Budgetly"}</p>
                            <p className="mt-1 text-xs text-budget-muted">{item.customer?.email ?? item.customer?.userLabel ?? "email oculto"}</p>
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <p className="font-semibold text-budget-text">{item.name}</p>
                        <p className="mt-1 text-xs text-budget-muted">{item.type}</p>
                      </Td>
                      <Td>
                        <Badge>{item.category}</Badge>
                      </Td>
                      <Td>{formatDate(item.date)}</Td>
                      <Td>
                        <Badge tone={item.source === "mercado_pago" ? "success" : "neutral"}>{item.source}</Badge>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-2">
                          <Badge tone={item.kind === "income" ? "success" : "danger"}>{item.kind === "income" ? "ingreso" : "egreso"}</Badge>
                          <Badge tone={item.invoice ? "success" : "warning"}>{item.invoice ? item.invoice.invoiceNumber : "sin comprobante"}</Badge>
                        </div>
                      </Td>
                      <Td className={`text-right font-semibold ${item.kind === "income" ? "text-budget-neon" : "text-red-300"}`}>
                        {formatMoney(item.amount)}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <aside className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Lectura operativa</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <StatusRow label="Manual" value={totals.manual} />
              <StatusRow label="Mercado Pago" value={totals.mercadoPago} />
              <StatusRow label="Con comprobante" value={totals.invoiceCount} />
              <StatusRow label="Pendiente comprobante" value={filtered.length - totals.invoiceCount} warning />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="grid gap-4">
              <div className="flex items-start gap-3">
                <Settings className="mt-0.5 h-4 w-4 text-budget-neon" />
                <div>
                  <p className="font-semibold text-budget-text">Control de privacidad</p>
                  <p className="mt-2 text-sm leading-6 text-budget-muted">
                    La tabla usa emails e IDs enmascarados. Las credenciales, passwords y tokens no viajan al cliente.
                  </p>
                </div>
              </div>
              <Link
                href="/admin/clients"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-budget-green px-4 text-sm font-semibold text-budget-bg shadow-glow transition hover:bg-budget-neon"
              >
                Ver clientes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function OperationMetric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone: "positive" | "negative" | "neutral";
}) {
  const toneClass = tone === "positive" ? "text-budget-neon" : tone === "negative" ? "text-red-300" : "text-budget-text";

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
            <Icon className="h-4 w-4" />
          </div>
          {tone === "negative" ? <AlertTriangle className="h-4 w-4 text-red-300" /> : null}
        </div>
        <p className="mt-4 text-sm text-budget-muted">{label}</p>
        <p className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 rounded-lg border border-budget-border bg-budget-surface px-3 text-sm font-medium text-budget-text outline-none transition focus:border-budget-green focus:ring-2 focus:ring-budget-green/20"
    >
      {options.map(({ value: optionValue, label }) => (
        <option key={optionValue} value={optionValue}>
          {label}
        </option>
      ))}
    </select>
  );
}

function StatusRow({ label, value, warning = false }: { label: string; value: number; warning?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface px-4 py-3">
      <span className="text-sm text-budget-muted">{label}</span>
      <Badge tone={warning && value > 0 ? "warning" : "success"}>{value}</Badge>
    </div>
  );
}

function Th({ className = "", ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={`border-b border-budget-border px-5 py-3 font-semibold ${className}`} {...props} />;
}

function Td({ className = "", ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`border-b border-budget-border px-5 py-4 align-top text-budget-muted ${className}`} {...props} />;
}

"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Search, Users, WalletCards, type LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

type Client = {
  userId: string;
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  role: string;
  plan: string;
  status: string;
  lastLoginAt: string | null;
  movements: number;
  uploads: number;
  extractions: number;
  activityLevel: string;
};

async function loadClients() {
  const response = await fetch("/api/admin/clients");
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudieron cargar clientes.");
  }

  return result.data.items as Client[];
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)) : "Sin acceso";
}

export function AdminClientsList() {
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["/api/admin/clients"], queryFn: loadClients });
  const clients = useMemo(() => query.data ?? [], [query.data]);
  const filteredClients = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) =>
      [client.fullName ?? "", client.email, client.role, client.plan, client.status, client.activityLevel]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [clients, search]);
  const totalMovements = clients.reduce((acc, client) => acc + client.movements, 0);
  const totalUploads = clients.reduce((acc, client) => acc + client.uploads, 0);
  const premiumClients = clients.filter((client) => client.plan !== "free").length;

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando clientes...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} label="Clientes" value={clients.length} />
        <SummaryCard icon={WalletCards} label="Movimientos" value={totalMovements} />
        <SummaryCard icon={FileText} label="Fotos" value={totalUploads} />
        <SummaryCard icon={ArrowRight} label="Planes pagos/mock" value={premiumClients} />
      </div>

      <Card>
        <CardContent className="grid gap-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-budget-dim" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email enmascarado, plan, rol o estado"
              className="h-10 w-full rounded-lg border border-budget-border bg-budget-surface pl-10 pr-3 text-sm text-budget-text outline-none transition placeholder:text-budget-dim focus:border-budget-green focus:ring-2 focus:ring-budget-green/20"
            />
          </label>

          <div className="grid gap-3">
            {filteredClients.length === 0 ? <p className="text-sm text-budget-muted">No hay clientes para ese filtro.</p> : null}
            {filteredClients.map((client) => (
              <Link
                key={client.userId}
                href={`/admin/clients/${client.userId}`}
                className="grid gap-4 rounded-lg border border-budget-border bg-budget-surface p-4 transition hover:border-budget-green/60 hover:bg-budget-hover xl:grid-cols-[auto_1fr_auto] xl:items-center"
              >
                <Avatar name={client.fullName ?? client.email} src={client.avatarUrl} size="lg" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-budget-text">{client.fullName ?? "Usuario sin nombre"}</p>
                    <Badge tone={client.status === "active" ? "success" : "neutral"}>{client.status}</Badge>
                    <Badge tone={client.plan === "free" ? "neutral" : "success"}>{client.plan}</Badge>
                    <Badge>{client.role}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-budget-muted">{client.email}</p>
                  <p className="mt-1 text-xs text-budget-dim">Ultimo acceso: {formatDate(client.lastLoginAt)}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-4 xl:min-w-[34rem]">
                  <Metric label="Movs" value={client.movements} />
                  <Metric label="Fotos" value={client.uploads} />
                  <Metric label="Datos" value={client.extractions} />
                  <Metric label="Actividad" value={client.activityLevel} />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string | number }) {
  return (
    <Card>
      <CardContent>
        <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
          <Icon className="h-4 w-4" />
        </div>
        <p className="mt-4 text-sm text-budget-muted">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-budget-text">{value}</p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-budget-border bg-budget-surface p-3">
      <p className="text-xs text-budget-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-budget-text">{value}</p>
    </div>
  );
}

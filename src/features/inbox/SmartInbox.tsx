"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type InboxData = {
  pendingExtractions: { id: string; concept: string | null; amount: number | null; confidence: number; status: string }[];
  pendingUploads: { id: string; fileName: string; kind: string; status: string }[];
  upcomingObligations: { id: string; name: string; amount: number; dueDay: number }[];
  latestInvoices: { id: string; invoiceNumber: string; concept: string; amount: number }[];
  recommendations: { title: string; description: string; href: string }[];
};

async function loadInbox() {
  const response = await fetch("/api/inbox");
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el inbox.");
  }

  return result.data as InboxData;
}

export function SmartInbox() {
  const query = useQuery({ queryKey: ["/api/inbox"], queryFn: loadInbox });
  const data = query.data;

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando inbox...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  if (!data) {
    return <EmptyState icon={Inbox} title="Inbox vacio" description="No hay pendientes inteligentes por ahora." />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fotos y datos pendientes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[...data.pendingExtractions, ...data.pendingUploads].length === 0 ? (
            <p className="text-sm text-budget-muted">No hay fotos pendientes de revisar.</p>
          ) : null}
          {data.pendingExtractions.map((item) => (
            <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-budget-text">{item.concept ?? "Extraccion pendiente"}</p>
                <Badge tone={item.confidence >= 0.75 ? "success" : "warning"}>{Math.round(item.confidence * 100)}%</Badge>
              </div>
              <p className="mt-1 text-sm text-budget-muted">Monto: {item.amount ?? "completar"} / {item.status}</p>
            </div>
          ))}
          {data.pendingUploads.map((item) => (
            <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-3">
              <p className="font-semibold text-budget-text">{item.fileName}</p>
              <p className="mt-1 text-sm text-budget-muted">{item.kind} / {item.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones recomendadas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.recommendations.map((item) => (
            <Link key={item.title} href={item.href} className="rounded-lg border border-budget-border bg-budget-surface p-3 transition-colors hover:bg-budget-hover">
              <p className="font-semibold text-budget-text">{item.title}</p>
              <p className="mt-1 text-sm text-budget-muted">{item.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Obligaciones proximas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.upcomingObligations.length === 0 ? <p className="text-sm text-budget-muted">Sin obligaciones pendientes.</p> : null}
          {data.upcomingObligations.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface p-3">
              <span className="font-semibold text-budget-text">{item.name}</span>
              <span className="text-sm text-budget-muted">Dia {item.dueDay}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comprobantes recientes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {data.latestInvoices.length === 0 ? <p className="text-sm text-budget-muted">Todavia no hay comprobantes.</p> : null}
          {data.latestInvoices.map((item) => (
            <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-3">
              <p className="font-semibold text-budget-text">{item.invoiceNumber}</p>
              <p className="mt-1 text-sm text-budget-muted">{item.concept}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

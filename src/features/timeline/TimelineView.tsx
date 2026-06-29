"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

type TimelineItem = {
  id: string;
  type: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  detail: string;
};

async function loadTimeline() {
  const response = await fetch("/api/timeline");
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el timeline.");
  }

  return result.data.items as TimelineItem[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(value));
}

export function TimelineView() {
  const query = useQuery({ queryKey: ["/api/timeline"], queryFn: loadTimeline });

  if (query.isLoading) {
    return <p className="text-sm text-budget-muted">Cargando timeline...</p>;
  }

  if (query.isError) {
    return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;
  }

  if (!query.data?.length) {
    return <EmptyState icon={CalendarDays} title="Sin eventos financieros" description="Carga movimientos, obligaciones o metas para construir tu timeline." />;
  }

  return (
    <Card>
      <CardContent className="grid gap-4">
        {query.data.map((item) => (
          <article key={item.id} className="grid gap-3 rounded-lg border border-budget-border bg-budget-surface p-4 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
            <p className="text-sm font-medium text-budget-muted">{formatDate(item.date)}</p>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-budget-text">{item.title}</p>
                <Badge tone={item.type === "expense" ? "warning" : item.type === "income" ? "success" : "neutral"}>{item.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-budget-muted">{item.detail}</p>
            </div>
            <p className="text-sm font-semibold text-budget-text">{item.amount.toLocaleString("es-AR")}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

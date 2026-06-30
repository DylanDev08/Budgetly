"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/Card";

async function loadResource(endpoint: string) {
  const response = await fetch(endpoint);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo cargar el recurso.");
  }

  return result.data?.items ?? result.items ?? result.data?.messages ?? result.data ?? [];
}

export function AdminResourceList({ endpoint }: { endpoint: string }) {
  const query = useQuery({ queryKey: [endpoint], queryFn: () => loadResource(endpoint) });

  if (query.isLoading) return <p className="text-sm text-budget-muted">Cargando...</p>;
  if (query.isError) return <p className="rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{query.error.message}</p>;

  const items = Array.isArray(query.data) ? query.data : query.data ? [query.data] : [];

  return (
    <Card>
      <CardContent className="grid gap-3">
        {items.length === 0 ? <p className="text-sm text-budget-muted">Sin registros para mostrar.</p> : null}
        {items.slice(0, 80).map((item: Record<string, unknown>, index: number) => (
          <pre key={String(item.id ?? index)} className="overflow-x-auto rounded-lg border border-budget-border bg-budget-surface p-3 text-xs leading-5 text-budget-muted">
            {JSON.stringify(item, null, 2)}
          </pre>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Invoice = {
  id: string;
  invoiceNumber: string;
  type: string;
  date: string;
  amount: number;
  concept: string;
  category: string;
  source: string;
  status: string;
};

async function apiJson<T>(input: RequestInfo): Promise<T> {
  const response = await fetch(input);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudieron cargar los comprobantes.");
  }

  return result;
}

export function InvoiceList() {
  const query = useQuery<{ items: Invoice[] }>({
    queryKey: ["/api/invoices"],
    queryFn: () => apiJson("/api/invoices"),
  });

  return (
    <div className="p-5 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Comprobantes internos</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? <p className="text-sm text-budget-muted">Cargando...</p> : null}
          {query.isError ? <p className="text-sm text-red-300">{query.error.message}</p> : null}
          {query.data?.items.length === 0 ? <p className="text-sm text-budget-muted">Todavia no hay comprobantes generados.</p> : null}
          <div className="grid gap-3">
            {query.data?.items.map((invoice) => (
              <div key={invoice.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-budget-text">{invoice.invoiceNumber}</p>
                    <p className="mt-1 text-sm text-budget-muted">
                      {invoice.concept} · {invoice.category} · {invoice.amount} · {invoice.date}
                    </p>
                    <p className="mt-1 text-xs text-budget-dim">Origen: {invoice.source}</p>
                  </div>
                  <Badge tone={invoice.type === "ingreso" ? "success" : "warning"}>{invoice.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

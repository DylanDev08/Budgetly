"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Pencil, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type Movement = {
  id: string;
  externalId?: string | null;
  kind: "income" | "expense";
  name: string;
  amount: number;
  category: string;
  type: string;
  source: string;
  date: string;
  note?: string | null;
  invoice?: { invoiceNumber: string } | null;
};

type MovementForm = {
  externalId: string;
  kind: "income" | "expense";
  name: string;
  amount: string;
  category: string;
  type: string;
  source: "manual" | "mercado_pago";
  date: string;
  note: string;
};

const initialValues: MovementForm = {
  externalId: "",
  kind: "expense",
  name: "",
  amount: "",
  category: "",
  type: "variable",
  source: "manual",
  date: new Date().toISOString().slice(0, 10),
  note: "",
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo completar la operacion.");
  }

  return result;
}

function toPayload(values: MovementForm) {
  return {
    ...values,
    externalId: values.externalId || null,
    amount: Number(values.amount),
    note: values.note || null,
  };
}

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function exportMovements(items: Movement[]) {
  const headers = ["externalId", "kind", "name", "amount", "category", "type", "source", "date", "note"];
  const rows = items.map((item) => headers.map((header) => csvEscape(item[header as keyof Movement])).join(","));
  const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "budgetly-movimientos.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsv(text: string) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));

  return lines
    .filter(Boolean)
    .map((line) => {
      const values = line.match(/("([^"]|"")*"|[^,]+)/g)?.map((value) => value.trim().replace(/^"|"$/g, "").replaceAll('""', '"')) ?? [];
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    })
    .map((row) => ({
      externalId: row.externalId || null,
      kind: row.kind,
      name: row.name,
      amount: Number(row.amount),
      category: row.category,
      type: row.type || "variable",
      source: row.source || "manual",
      date: row.date,
      note: row.note || null,
    }));
}

export function MovementManager() {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<MovementForm>(initialValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const query = useQuery<{ items: Movement[] }>({
    queryKey: ["/api/transactions"],
    queryFn: () => apiJson("/api/transactions"),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      apiJson(editingId ? `/api/transactions/${editingId}` : "/api/transactions", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(values)),
      }),
    onSuccess: async () => {
      setValues(initialValues);
      setEditingId(null);
      setMessage("Movimiento guardado. El comprobante se genera automaticamente al crear.");
      await queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error) => setMessage(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiJson(`/api/transactions/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      setMessage("Movimiento eliminado.");
      await queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error) => setMessage(error.message),
  });

  const importMutation = useMutation({
    mutationFn: (transactions: unknown[]) =>
      apiJson<{ imported?: number; skipped?: number }>("/api/transactions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactions }),
      }),
    onSuccess: async (result: { imported?: number; skipped?: number }) => {
      setMessage(`Importacion lista. Importados: ${result.imported ?? 0}. Omitidos: ${result.skipped ?? 0}.`);
      await queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error) => setMessage(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveMutation.mutate();
  }

  function edit(item: Movement) {
    setEditingId(item.id);
    setValues({
      externalId: item.externalId ?? "",
      kind: item.kind,
      name: item.name,
      amount: String(item.amount),
      category: item.category,
      type: item.type,
      source: item.source as "manual" | "mercado_pago",
      date: item.date,
      note: item.note ?? "",
    });
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const text = await file.text();
    importMutation.mutate(parseCsv(text));
    event.target.value = "";
  }

  return (
    <div className="grid gap-5 p-5 sm:p-8 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Editar movimiento" : "Nuevo movimiento"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            <Select label="Tipo de movimiento" value={values.kind} onChange={(event) => setValues((current) => ({ ...current, kind: event.target.value as MovementForm["kind"] }))}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </Select>
            <Input label="Nombre" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} required />
            <Input label="Monto" type="number" min="0" step="0.01" value={values.amount} onChange={(event) => setValues((current) => ({ ...current, amount: event.target.value }))} required />
            <Input label="Categoria" value={values.category} onChange={(event) => setValues((current) => ({ ...current, category: event.target.value }))} required />
            <Select label="Frecuencia" value={values.type} onChange={(event) => setValues((current) => ({ ...current, type: event.target.value }))}>
              <option value="fijo">Fijo</option>
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
              <option value="variable">Variable</option>
              <option value="unico">Unico</option>
            </Select>
            <Input label="Fecha" type="date" value={values.date} onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))} required />
            <Input label="External ID" value={values.externalId} onChange={(event) => setValues((current) => ({ ...current, externalId: event.target.value }))} placeholder="Opcional para imports" />
            <Input label="Nota" value={values.note} onChange={(event) => setValues((current) => ({ ...current, note: event.target.value }))} />
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {saveMutation.isPending ? "Guardando..." : editingId ? "Guardar cambios" : "Crear movimiento"}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setValues(initialValues); }}>
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              ) : null}
            </div>
            {message ? <p className="text-sm font-medium text-budget-muted">{message}</p> : null}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Movimientos</CardTitle>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-budget-border bg-budget-card px-4 text-sm font-medium text-budget-text transition-colors hover:bg-budget-hover">
                <Upload className="h-4 w-4" />
                Importar CSV
                <input type="file" accept=".csv,text/csv" className="hidden" onChange={importFile} />
              </label>
              <Button variant="secondary" onClick={() => exportMovements(query.data?.items ?? [])}>
                <Download className="h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {query.isLoading ? <p className="text-sm text-budget-muted">Cargando...</p> : null}
          {query.isError ? <p className="text-sm text-red-300">{query.error.message}</p> : null}
          {query.data?.items.length === 0 ? <p className="text-sm text-budget-muted">Todavia no tenes movimientos.</p> : null}
          <div className="grid gap-3">
            {query.data?.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-budget-text">{item.name}</p>
                    <p className="mt-1 text-sm text-budget-muted">
                      {item.kind === "income" ? "Ingreso" : "Gasto"} · {item.category} · {item.amount} · {item.date}
                    </p>
                    {item.invoice ? <p className="mt-1 text-xs text-budget-dim">Comprobante {item.invoice.invoiceNumber}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => edit(item)}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm("Confirmas eliminar este movimiento y su comprobante asociado?")) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type FieldType = "text" | "number" | "date" | "time" | "select" | "boolean";

export type CrudField = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
};

type CrudItem = {
  id: string;
  [key: string]: unknown;
};

type CrudPanelProps = {
  title: string;
  endpoint: string;
  fields: CrudField[];
  emptyText: string;
  describeItem: (item: CrudItem) => string;
  renderActions?: (item: CrudItem, refresh: () => Promise<void>, setMessage: (message: string) => void) => ReactNode;
};

async function apiJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error ?? "No se pudo completar la operacion.");
  }

  return result;
}

function buildInitialValues(fields: CrudField[]) {
  return Object.fromEntries(
    fields.map((field) => {
      if (field.type === "boolean") {
        return [field.name, "false"];
      }

      if (field.type === "select") {
        return [field.name, field.options?.[0]?.value ?? ""];
      }

      return [field.name, ""];
    }),
  ) as Record<string, string>;
}

function normalizeValue(field: CrudField, value: string) {
  if (field.type === "number") {
    return Number(value);
  }

  if (field.type === "boolean") {
    return value === "true";
  }

  return value || null;
}

export function CrudPanel({ title, endpoint, fields, emptyText, describeItem, renderActions }: CrudPanelProps) {
  const queryClient = useQueryClient();
  const initialValues = useMemo(() => buildInitialValues(fields), [fields]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const query = useQuery<{ items: CrudItem[] }>({
    queryKey: [endpoint],
    queryFn: () => apiJson(endpoint),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiJson(editingId ? `${endpoint}/${editingId}` : endpoint, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: async () => {
      setValues(initialValues);
      setEditingId(null);
      setMessage("Guardado correctamente.");
      await queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error) => setMessage(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiJson(`${endpoint}/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      setMessage("Eliminado correctamente.");
      await queryClient.invalidateQueries({ queryKey: [endpoint] });
    },
    onError: (error) => setMessage(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(fields.map((field) => [field.name, normalizeValue(field, values[field.name] ?? "")]));
    saveMutation.mutate(payload);
  }

  function edit(item: CrudItem) {
    setEditingId(item.id);
    setValues(
      Object.fromEntries(
        fields.map((field) => {
          const value = item[field.name];
          return [field.name, value === null || value === undefined ? "" : String(value)];
        }),
      ) as Record<string, string>,
    );
  }

  function cancelEdit() {
    setEditingId(null);
    setValues(initialValues);
  }

  return (
    <div className="grid gap-5 p-5 sm:p-8 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? `Editar ${title}` : `Nuevo ${title}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            {fields.map((field) =>
              field.type === "select" || field.type === "boolean" ? (
                <Select
                  key={field.name}
                  label={field.label}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  required={field.required}
                >
                  {field.type === "boolean" ? (
                    <>
                      <option value="false">No</option>
                      <option value="true">Si</option>
                    </>
                  ) : (
                    field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))
                  )}
                </Select>
              ) : (
                <Input
                  key={field.name}
                  label={field.label}
                  type={field.type}
                  min={field.type === "number" ? "0" : undefined}
                  step={field.type === "number" ? "0.01" : undefined}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                  required={field.required}
                />
              ),
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saveMutation.isPending}>
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {saveMutation.isPending ? "Guardando..." : editingId ? "Guardar cambios" : "Crear"}
              </Button>
              {editingId ? (
                <Button type="button" variant="secondary" onClick={cancelEdit}>
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
          <CardTitle>Registros</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? <p className="text-sm text-budget-muted">Cargando...</p> : null}
          {query.isError ? <p className="text-sm text-red-300">{query.error.message}</p> : null}
          {query.data?.items.length === 0 ? <p className="text-sm text-budget-muted">{emptyText}</p> : null}
          <div className="grid gap-3">
            {query.data?.items.map((item) => (
              <div key={item.id} className="rounded-lg border border-budget-border bg-budget-surface p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-semibold text-budget-text">{String(item.name ?? item.activity ?? "Registro")}</p>
                    <p className="mt-1 text-sm leading-6 text-budget-muted">{describeItem(item)}</p>
                  </div>
                  <div className="flex gap-2">
                    {renderActions?.(item, async () => {
                      await queryClient.invalidateQueries({ queryKey: [endpoint] });
                    }, setMessage)}
                    <Button size="sm" variant="secondary" onClick={() => edit(item)}>
                      <Pencil className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm("Confirmas eliminar este registro?")) {
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

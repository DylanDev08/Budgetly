"use client";

import { CrudPanel, type CrudField } from "@/features/crud/CrudPanel";

const fields: CrudField[] = [
  { name: "name", label: "Nombre", type: "text", placeholder: "Presupuesto mensual", required: true },
  { name: "category", label: "Categoria", type: "text", placeholder: "Comida, ocio, transporte" },
  {
    name: "type",
    label: "Tipo",
    type: "select",
    options: [
      { label: "Mensual", value: "mensual" },
      { label: "Semanal", value: "semanal" },
      { label: "Variable", value: "variable" },
      { label: "Categoria", value: "categoria" },
    ],
    required: true,
  },
  { name: "limitAmount", label: "Limite", type: "number", required: true },
  { name: "alertPercentage", label: "Alerta desde %", type: "number", required: true },
];

export function BudgetManager() {
  return (
    <CrudPanel
      title="presupuesto"
      endpoint="/api/budgets"
      fields={fields}
      emptyText="Todavia no configuraste limites."
      describeItem={(item) => `${item.type} · ${item.category ?? "general"} · limite ${item.limitAmount} · alerta ${item.alertPercentage}%`}
    />
  );
}

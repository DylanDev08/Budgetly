"use client";

import { CrudPanel, type CrudField } from "@/features/crud/CrudPanel";

const fields: CrudField[] = [
  { name: "name", label: "Nombre", type: "text", placeholder: "Notebook, fondo de emergencia", required: true },
  { name: "targetAmount", label: "Monto objetivo", type: "number", required: true },
  { name: "currentAmount", label: "Monto actual", type: "number", required: true },
  { name: "deadline", label: "Fecha limite", type: "date" },
  {
    name: "priority",
    label: "Prioridad",
    type: "select",
    options: [
      { label: "Baja", value: "baja" },
      { label: "Media", value: "media" },
      { label: "Alta", value: "alta" },
    ],
    required: true,
  },
  { name: "autoEnabled", label: "Aporte automatico sugerido", type: "boolean" },
  { name: "autoPercentage", label: "Porcentaje sugerido", type: "number", required: true },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { label: "Activa", value: "activa" },
      { label: "Pausada", value: "pausada" },
      { label: "Completada", value: "completada" },
    ],
    required: true,
  },
];

export function GoalManager() {
  return (
    <CrudPanel
      title="meta"
      endpoint="/api/goals"
      fields={fields}
      emptyText="Todavia no cargaste metas financieras."
      describeItem={(item) => `${item.currentAmount} de ${item.targetAmount} · prioridad ${item.priority} · ${item.status}`}
    />
  );
}

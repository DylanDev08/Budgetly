"use client";

import { CrudPanel, type CrudField } from "@/features/crud/CrudPanel";

const fields: CrudField[] = [
  { name: "name", label: "Nombre", type: "text", placeholder: "Revisar gastos, estudiar, gym", required: true },
  {
    name: "frequency",
    label: "Frecuencia",
    type: "select",
    options: [
      { label: "Diaria", value: "diaria" },
      { label: "Semanal", value: "semanal" },
      { label: "Mensual", value: "mensual" },
    ],
    required: true,
  },
  { name: "done", label: "Hecha", type: "boolean" },
  { name: "streak", label: "Racha", type: "number", required: true },
];

export function RoutineManager() {
  return (
    <CrudPanel
      title="rutina"
      endpoint="/api/routines"
      fields={fields}
      emptyText="Todavia no cargaste rutinas."
      describeItem={(item) => `${item.frequency} · ${item.done === true ? "hecha" : "pendiente"} · racha ${item.streak}`}
    />
  );
}

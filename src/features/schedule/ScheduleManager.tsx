"use client";

import { CrudPanel, type CrudField } from "@/features/crud/CrudPanel";

const fields: CrudField[] = [
  {
    name: "day",
    label: "Dia",
    type: "select",
    options: [
      { label: "Lunes", value: "lunes" },
      { label: "Martes", value: "martes" },
      { label: "Miercoles", value: "miercoles" },
      { label: "Jueves", value: "jueves" },
      { label: "Viernes", value: "viernes" },
      { label: "Sabado", value: "sabado" },
      { label: "Domingo", value: "domingo" },
    ],
    required: true,
  },
  { name: "startTime", label: "Inicio", type: "time", required: true },
  { name: "endTime", label: "Fin", type: "time", required: true },
  { name: "activity", label: "Actividad", type: "text", required: true },
  {
    name: "area",
    label: "Area",
    type: "select",
    options: [
      { label: "Trabajo", value: "trabajo" },
      { label: "Estudio", value: "estudio" },
      { label: "Gym", value: "gym" },
      { label: "Descanso", value: "descanso" },
      { label: "Finanzas", value: "finanzas" },
      { label: "Otro", value: "otro" },
    ],
    required: true,
  },
];

export function ScheduleManager() {
  return (
    <CrudPanel
      title="bloque horario"
      endpoint="/api/schedule-blocks"
      fields={fields}
      emptyText="Todavia no cargaste bloques en tu agenda."
      describeItem={(item) => `${item.day} · ${item.startTime} a ${item.endTime} · area ${item.area}`}
    />
  );
}

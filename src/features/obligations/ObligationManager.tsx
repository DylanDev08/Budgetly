"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CrudPanel, type CrudField } from "@/features/crud/CrudPanel";

const fields: CrudField[] = [
  { name: "name", label: "Nombre", type: "text", placeholder: "Internet, alquiler, tarjeta", required: true },
  { name: "amount", label: "Monto", type: "number", required: true },
  { name: "category", label: "Categoria", type: "text", required: true },
  {
    name: "frequency",
    label: "Frecuencia",
    type: "select",
    options: [
      { label: "Mensual", value: "mensual" },
      { label: "Semanal", value: "semanal" },
      { label: "Unica", value: "unica" },
    ],
    required: true,
  },
  { name: "dueDay", label: "Dia de vencimiento", type: "number", required: true },
  {
    name: "status",
    label: "Estado",
    type: "select",
    options: [
      { label: "Pendiente", value: "pendiente" },
      { label: "Pagado", value: "pagado" },
    ],
    required: true,
  },
  { name: "autoCreateTransaction", label: "Crear egreso automatico al pagar", type: "boolean" },
];

export function ObligationManager() {
  return (
    <CrudPanel
      title="obligacion"
      endpoint="/api/obligations"
      fields={fields}
      emptyText="Todavia no cargaste obligaciones."
      describeItem={(item) => `${item.category} · vence dia ${item.dueDay} · ${item.status} · monto ${item.amount}`}
      renderActions={(item, refresh, setMessage) =>
        item.status === "pagado" ? null : (
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              const response = await fetch(`/api/obligations/${item.id}/pay`, { method: "POST" });
              const result = await response.json().catch(() => ({}));

              if (!response.ok) {
                setMessage(result.error ?? "No se pudo marcar como pagada.");
                return;
              }

              setMessage("Obligacion pagada. Se creo egreso y comprobante.");
              await refresh();
            }}
          >
            <CheckCircle className="h-4 w-4" />
            Pagar
          </Button>
        )
      }
    />
  );
}

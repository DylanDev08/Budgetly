import { Plus, Receipt } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function ObligationsPage() {
  return (
    <BasePage
      title="Obligaciones"
      description="Servicios, suscripciones, cuotas, deudas y pagos recurrentes."
      icon={Receipt}
      emptyTitle="Sin obligaciones pendientes"
      emptyDescription="Cuando se marque una obligacion como pagada, la app podra crear el egreso y su comprobante interno."
      actions={<Button><Plus className="h-4 w-4" />Nueva obligacion</Button>}
    />
  );
}

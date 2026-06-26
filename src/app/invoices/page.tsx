import { FileText } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";

export default function InvoicesPage() {
  return (
    <BasePage
      title="Comprobantes"
      description="Comprobantes internos asociados a ingresos, egresos y sincronizaciones."
      icon={FileText}
      emptyTitle="Sin comprobantes generados"
      emptyDescription="Cada movimiento manual o importado generara un comprobante interno, no una factura legal AFIP."
    />
  );
}

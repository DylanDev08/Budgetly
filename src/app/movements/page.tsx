import { Plus, WalletCards } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function MovementsPage() {
  return (
    <BasePage
      title="Movimientos"
      description="Alta, edicion, filtros y trazabilidad de ingresos y egresos."
      icon={WalletCards}
      emptyTitle="Sin movimientos registrados"
      emptyDescription="El CRUD de movimientos se implementa en la fase de transacciones con comprobantes internos automaticos."
      actions={<Button><Plus className="h-4 w-4" />Nuevo movimiento</Button>}
    />
  );
}

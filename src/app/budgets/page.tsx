import { Gauge, Plus } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function BudgetsPage() {
  return (
    <BasePage
      title="Presupuestos"
      description="Limites mensuales, semanales, variables y por categoria."
      icon={Gauge}
      emptyTitle="Sin presupuestos configurados"
      emptyDescription="Los limites y alertas por 80%, 100% y 120% se activaran cuando conectemos perfiles y movimientos."
      actions={<Button disabled title="El CRUD real de presupuestos se implementa en la fase de presupuestos."><Plus className="h-4 w-4" />Nuevo presupuesto</Button>}
    />
  );
}

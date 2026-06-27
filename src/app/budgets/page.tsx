import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { BudgetManager } from "@/features/budgets/BudgetManager";

export default function BudgetsPage() {
  return (
    <>
      <PageHeader title="Presupuestos" description="Limites mensuales, semanales, variables y por categoria." icon={Gauge} />
      <BudgetManager />
    </>
  );
}

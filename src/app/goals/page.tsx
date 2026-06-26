import { Plus, Target } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function GoalsPage() {
  return (
    <BasePage
      title="Metas"
      description="Objetivos financieros, progreso real, prioridad y aportes automaticos configurables."
      icon={Target}
      emptyTitle="Sin metas financieras"
      emptyDescription="Las metas van a calcular progreso y sugerencias segun balance mensual y prioridad."
      actions={<Button><Plus className="h-4 w-4" />Nueva meta</Button>}
    />
  );
}

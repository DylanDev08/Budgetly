import { ListChecks, Plus } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function RoutinesPage() {
  return (
    <BasePage
      title="Rutinas"
      description="Seguimiento de habitos, frecuencia, cumplimiento y rachas."
      icon={ListChecks}
      emptyTitle="Sin rutinas cargadas"
      emptyDescription="Las rutinas se van a administrar con checks, frecuencia y estadisticas de cumplimiento."
      actions={<Button><Plus className="h-4 w-4" />Nueva rutina</Button>}
    />
  );
}

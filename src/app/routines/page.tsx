import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoutineManager } from "@/features/routines/RoutineManager";

export default function RoutinesPage() {
  return (
    <>
      <PageHeader title="Rutinas" description="Seguimiento de habitos, frecuencia, cumplimiento y rachas." icon={ListChecks} />
      <RoutineManager />
    </>
  );
}

import { Target } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { GoalManager } from "@/features/goals/GoalManager";

export default function GoalsPage() {
  return (
    <>
      <PageHeader title="Metas" description="Objetivos financieros, progreso real, prioridad y aportes automaticos configurables." icon={Target} />
      <GoalManager />
    </>
  );
}

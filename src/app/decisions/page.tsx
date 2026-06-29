import { Target } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DecisionSimulator } from "@/features/decisions/DecisionSimulator";

export default function DecisionsPage() {
  return (
    <>
      <PageHeader
        title="Mapa de decisiones"
        description="Compara escenarios cotidianos de compra, ahorro, pago e inversion educativa."
        icon={Target}
      />
      <main className="p-5 sm:p-8">
        <DecisionSimulator />
      </main>
    </>
  );
}

import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ObligationManager } from "@/features/obligations/ObligationManager";

export default function ObligationsPage() {
  return (
    <>
      <PageHeader title="Obligaciones" description="Servicios, suscripciones, cuotas, deudas y pagos recurrentes." icon={Receipt} />
      <ObligationManager />
    </>
  );
}

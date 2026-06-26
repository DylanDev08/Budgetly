import { Landmark } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";

export default function InvestmentsPage() {
  return (
    <BasePage
      title="Inversion educativa"
      description="Analisis de perfil de riesgo, disponibilidad y senales educativas sin ejecutar operaciones."
      icon={Landmark}
      emptyTitle="Modulo educativo sin datos"
      emptyDescription="El motor de inversion no va a comprar ni vender activos; solo devolvera recomendaciones educativas y advertencias."
    />
  );
}

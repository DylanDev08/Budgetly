import { Bot } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";

export default function AssistantPage() {
  return (
    <BasePage
      title="Bot asistente"
      description="Asistente financiero basado en reglas locales y preparado para IA futura."
      icon={Bot}
      emptyTitle="Asistente listo para reglas locales"
      emptyDescription="El bot respondera usando datos reales de movimientos, presupuestos, obligaciones, metas, horarios y ajustes."
    />
  );
}

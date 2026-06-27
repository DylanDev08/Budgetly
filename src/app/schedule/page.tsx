import { CalendarDays, Plus } from "lucide-react";
import { BasePage } from "@/components/layout/BasePage";
import { Button } from "@/components/ui/Button";

export default function SchedulePage() {
  return (
    <BasePage
      title="Horarios"
      description="Agenda semanal para trabajo, estudio, descanso, finanzas y otras areas."
      icon={CalendarDays}
      emptyTitle="Sin bloques horarios"
      emptyDescription="La agenda semanal va a mostrar bloques por dia, hora de inicio, hora de fin y area."
      actions={<Button disabled title="La edicion de agenda se implementa en la fase de horarios."><Plus className="h-4 w-4" />Nuevo bloque</Button>}
    />
  );
}

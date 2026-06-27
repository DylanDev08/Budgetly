import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScheduleManager } from "@/features/schedule/ScheduleManager";

export default function SchedulePage() {
  return (
    <>
      <PageHeader title="Horarios" description="Agenda semanal para trabajo, estudio, descanso, finanzas y otras areas." icon={CalendarDays} />
      <ScheduleManager />
    </>
  );
}

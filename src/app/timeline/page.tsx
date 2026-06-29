import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TimelineView } from "@/features/timeline/TimelineView";

export default function TimelinePage() {
  return (
    <>
      <PageHeader
        title="Timeline financiero"
        description="Linea de tiempo con ingresos, gastos, obligaciones, metas y movimientos importados."
        icon={CalendarDays}
      />
      <main className="p-5 sm:p-8">
        <TimelineView />
      </main>
    </>
  );
}

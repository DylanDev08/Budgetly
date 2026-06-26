import { PageHeader } from "@/components/ui/PageHeader";
import { FinancialOverview } from "@/features/dashboard/FinancialOverview";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Resumen operativo de ingresos, egresos, presupuesto, obligaciones y metas."
      />
      <div className="p-5 sm:p-8">
        <FinancialOverview />
      </div>
    </>
  );
}

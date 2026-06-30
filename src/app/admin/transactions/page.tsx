import { ArrowLeftRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminOperationsPanel } from "@/features/admin/AdminOperationsPanel";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminTransactionsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Movimientos globales" description="Tablero operativo tipo ventas, adaptado al flujo financiero de Budgetly." icon={ArrowLeftRight} />
      <main className="p-5 sm:p-8">
        <AdminOperationsPanel />
      </main>
    </>
  );
}

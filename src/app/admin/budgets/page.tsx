import { WalletCards } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminBudgetsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Presupuestos globales" description="Presupuestos configurados por clientes." icon={WalletCards} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/budgets" />
      </main>
    </>
  );
}

import { Target } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminGoalsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Metas globales" description="Metas financieras activas e historicas de clientes." icon={Target} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/goals" />
      </main>
    </>
  );
}

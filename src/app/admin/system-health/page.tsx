import { Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminSystemHealthPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Salud del sistema" description="Estado de entorno, DB, Supabase y conteos operativos." icon={Gauge} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/system-health" />
      </main>
    </>
  );
}

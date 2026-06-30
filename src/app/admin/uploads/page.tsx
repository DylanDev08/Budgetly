import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminUploadsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Fotos / Archivos" description="Archivos subidos por clientes, sin exponer secretos ni tokens." icon={FileText} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/uploads" />
      </main>
    </>
  );
}

import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminAuditLogsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Audit logs" description="Acciones relevantes registradas sin metadata sensible." icon={ShieldCheck} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/audit-logs" />
      </main>
    </>
  );
}

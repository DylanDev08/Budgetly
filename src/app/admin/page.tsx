import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminDashboardOverview } from "@/features/admin/AdminDashboardOverview";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Admin" description="Dashboard operativo de clientes, finanzas, seguridad y actividad." icon={ShieldCheck} />
      <AdminDashboardOverview />
    </>
  );
}

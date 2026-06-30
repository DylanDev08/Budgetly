import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminProfilesPanel } from "@/features/admin/AdminProfilesPanel";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminUsersPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Usuarios" description="CRUD local de perfiles, roles, planes y preferencias." icon={Users} />
      <AdminProfilesPanel />
    </>
  );
}

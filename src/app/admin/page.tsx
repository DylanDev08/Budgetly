import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminProfilesPanel } from "@/features/admin/AdminProfilesPanel";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Admin" description="Control de usuarios, perfiles locales, planes y logins externos." icon={ShieldCheck} />
      <AdminProfilesPanel />
    </>
  );
}

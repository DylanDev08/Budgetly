import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminProfilesPanel } from "@/features/admin/AdminProfilesPanel";

export default function AdminPage() {
  return (
    <>
      <PageHeader title="Admin" description="Panel local para perfiles registrados en Budgetly." icon={ShieldCheck} />
      <AdminProfilesPanel />
    </>
  );
}

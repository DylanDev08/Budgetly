import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminPlansPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Planes" description="Planes Free, Premium y Pro preparados para CRUD administrativo." icon={Sparkles} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/plans" />
      </main>
    </>
  );
}

import { Flag } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminFeatureFlagsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Feature flags" description="Control de features por plan y estado de activacion." icon={Flag} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/feature-flags" />
      </main>
    </>
  );
}

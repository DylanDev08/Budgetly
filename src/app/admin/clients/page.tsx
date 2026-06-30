import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminClientsList } from "@/features/admin/AdminClientsList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminClientsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Clientes" description="Listado operativo de clientes, actividad, fotos y datos extraidos." icon={Users} />
      <main className="p-5 sm:p-8">
        <AdminClientsList />
      </main>
    </>
  );
}

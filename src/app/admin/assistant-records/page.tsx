import { Bot } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminAssistantRecordsPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Registros del asistente" description="Mensajes y datos extraidos desde imagenes." icon={Bot} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/assistant-records" />
      </main>
    </>
  );
}

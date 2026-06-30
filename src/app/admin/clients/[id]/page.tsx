import { Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminClientDetail } from "@/features/admin/AdminClientDetail";
import { requireAdmin } from "@/lib/auth/require-admin";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminClientDetailPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;

  return (
    <>
      <PageHeader title="Detalle de cliente" description="Ficha completa con finanzas, agenda, fotos, chatbot y auditoria." icon={Users} />
      <main className="p-5 sm:p-8">
        <AdminClientDetail userId={id} />
      </main>
    </>
  );
}

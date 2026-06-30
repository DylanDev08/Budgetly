import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdminResourceList } from "@/features/admin/AdminResourceList";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminMercadoPagoPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader title="Mercado Pago" description="Estado de conexiones financieras sin exponer tokens." icon={CreditCard} />
      <main className="p-5 sm:p-8">
        <AdminResourceList endpoint="/api/admin/mercado-pago" />
      </main>
    </>
  );
}

import { FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { InvoiceList } from "@/features/invoices/InvoiceList";

export default function InvoicesPage() {
  return (
    <>
      <PageHeader title="Comprobantes" description="Comprobantes internos asociados a ingresos, egresos y sincronizaciones." icon={FileText} />
      <InvoiceList />
    </>
  );
}

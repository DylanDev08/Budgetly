import { CreditCard } from "lucide-react";
import { MercadoPagoConnectionCard } from "@/features/mercadoPago/MercadoPagoConnectionCard";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MercadoPagoPage() {
  return (
    <>
      <PageHeader
        title="Mercado Pago"
        description="Conexion personal para importar ingresos, egresos y movimientos normalizados."
      />
      <div className="p-5 sm:p-8">
        <MercadoPagoConnectionCard icon={CreditCard} />
      </div>
    </>
  );
}

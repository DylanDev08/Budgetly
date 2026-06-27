import { WalletCards } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { MovementManager } from "@/features/movements/MovementManager";

export default function MovementsPage() {
  return (
    <>
      <PageHeader
        title="Movimientos"
        description="Alta, edicion, importacion CSV, exportacion CSV y comprobantes internos automaticos."
        icon={WalletCards}
      />
      <MovementManager />
    </>
  );
}

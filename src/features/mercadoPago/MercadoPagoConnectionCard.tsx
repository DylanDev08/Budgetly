import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function MercadoPagoConnectionCard({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Conexion personal de Mercado Pago</CardTitle>
          <Badge tone="warning">No conectado</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="rounded-lg bg-budget-soft p-3 text-budget-dark">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="grid flex-1 gap-4">
            <p className="text-sm leading-6 text-budget-muted">
              La conexion se inicia desde el backend para no exponer tokens. Cuando agregues credenciales reales,
              Budgetly va a redirigir al OAuth de Mercado Pago y guardar la vinculacion por usuario.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/mercado-pago/connect"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-budget-green px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-budget-dark"
              >
                Conectar Mercado Pago
              </Link>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-budget-border bg-white px-4 text-sm font-medium text-budget-text transition-colors hover:bg-slate-50"
              >
                Sincronizar movimientos
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

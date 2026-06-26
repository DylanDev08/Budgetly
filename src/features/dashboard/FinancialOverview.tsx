import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Landmark, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Progress } from "@/components/ui/Progress";
import { StatCard } from "@/components/ui/StatCard";

export function FinancialOverview() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ingresos del mes" value="$0" helper="Sin movimientos cargados" icon={ArrowUpCircle} />
        <StatCard title="Gastos del mes" value="$0" helper="Sin egresos registrados" icon={ArrowDownCircle} />
        <StatCard title="Balance actual" value="$0" helper="Esperando datos reales" icon={Wallet} />
        <StatCard title="Gastos de la semana" value="$0" helper="Sin actividad semanal" icon={Landmark} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle>Uso de presupuesto</CardTitle>
              <Badge tone="neutral">Sin configurar</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-budget-muted">Presupuesto mensual usado</span>
                <span className="font-semibold text-budget-text">0%</span>
              </div>
              <Progress value={0} />
              <p className="text-sm leading-6 text-budget-muted">
                Cuando configures tu presupuesto mensual, este panel va a mostrar advertencias por 80%, 100% y 120%.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado financiero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-budget-text">Pendiente de datos</p>
                <p className="mt-2 text-sm leading-6 text-budget-muted">
                  El estado financiero se calcula con ingresos, egresos, obligaciones, metas y limites configurados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <EmptyState
          icon={ArrowDownCircle}
          title="Sin categorias de gasto"
          description="Las categorias se van a completar cuando cargues movimientos manuales o sincronizados desde Mercado Pago."
        />
        <EmptyState
          icon={Wallet}
          title="Sin movimientos recientes"
          description="Los ultimos movimientos apareceran aca con su comprobante interno asociado."
        />
      </div>
    </div>
  );
}

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PremiumMockActivate } from "@/features/premium/PremiumMockActivate";

const plans = [
  {
    name: "Free",
    price: "$0",
    badge: "Actual para empezar",
    features: ["Dashboard basico", "Movimientos manuales", "Metas simples", "Asistente local basico"],
  },
  {
    name: "Premium",
    price: "ARS a definir",
    badge: "Para uso cotidiano",
    features: ["Movimientos ilimitados", "Alertas avanzadas", "Exportaciones", "Sincronizacion MP avanzada"],
  },
  {
    name: "Pro",
    price: "ARS a definir",
    badge: "Para analisis completo",
    features: ["Reportes avanzados", "Comparativas mensuales", "Inversion educativa completa", "Soporte prioritario"],
  },
];

export default function PremiumPage() {
  return (
    <>
      <PageHeader
        title="Premium"
        description="Planes preparados para escalar Budgetly sin activar cobros reales todavia."
        icon={Sparkles}
      />
      <main className="grid gap-5 p-5 sm:p-8">
        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="transition-colors hover:bg-budget-hover">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="mt-2 text-2xl font-semibold text-budget-text">{plan.price}</p>
                  </div>
                  <Badge tone={plan.name === "Free" ? "neutral" : "success"}>{plan.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm text-budget-muted">
                  {plan.features.map((feature) => (
                    <li key={feature} className="rounded-lg border border-budget-border bg-budget-surface p-3">
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <PremiumMockActivate />
      </main>
    </>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

const plans = [
  { name: "Free", price: "$0", tone: "neutral" as const, features: ["Dashboard base", "Movimientos manuales", "Metas simples"] },
  { name: "Premium", price: "ARS a definir", tone: "success" as const, features: ["Pulse completo", "Simulador de decisiones", "Alertas avanzadas"] },
  { name: "Pro", price: "ARS a definir", tone: "success" as const, features: ["Escenarios de mercado", "Reportes avanzados", "Prediccion de cashflow"] },
];

export function PricingPreview() {
  return (
    <section className="bg-budget-bg px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Planes</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Free, Premium y Pro para crecer por etapas.</h2>
          </div>
          <Link href="/pricing" className="text-sm font-semibold text-budget-neon hover:text-budget-green">Comparar planes</Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="rounded-lg border border-budget-border bg-budget-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-budget-text">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-semibold text-budget-text">{plan.price}</p>
                </div>
                <Badge tone={plan.tone}>{plan.name === "Free" ? "Inicio" : "Escala"}</Badge>
              </div>
              <ul className="mt-6 grid gap-3 text-sm text-budget-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="rounded-lg border border-budget-border bg-budget-surface p-3">{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

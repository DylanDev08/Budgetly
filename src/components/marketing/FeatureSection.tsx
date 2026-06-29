import { Bot, CreditCard, Landmark, Target, WalletCards } from "lucide-react";

const features = [
  {
    title: "Control financiero",
    description: "Movimientos, comprobantes, importaciones y presupuesto en una sola rutina diaria.",
    icon: WalletCards,
  },
  {
    title: "Metas inteligentes",
    description: "Progreso real, prioridades y sugerencias para avanzar sin desordenar el mes.",
    icon: Target,
  },
  {
    title: "Asistente con memoria",
    description: "Respuestas basadas en movimientos, obligaciones, rutinas, metas e historial.",
    icon: Bot,
  },
  {
    title: "Mercado Pago sync",
    description: "Flujo financiero separado de pagos premium, preparado para OAuth real.",
    icon: CreditCard,
  },
  {
    title: "Inversion educativa",
    description: "Escenarios y riesgo sin ejecutar compras ni prometer ganancias.",
    icon: Landmark,
  },
];

export function FeatureSection() {
  return (
    <section className="bg-budget-bg px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Modulos principales</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Un sistema operativo financiero, no un CRUD de gastos.</h2>
          <p className="mt-4 text-sm leading-6 text-budget-muted">
            Budgetly organiza la vida financiera en modulos que se conectan entre si: dinero, tiempo, obligaciones, metas y decisiones.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="rounded-lg border border-budget-border bg-budget-card p-5 transition-colors hover:bg-budget-hover">
                <div className="mb-5 w-fit rounded-lg bg-budget-soft p-3 text-budget-neon">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-budget-text">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-budget-muted">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

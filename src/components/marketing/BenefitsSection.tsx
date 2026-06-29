const benefits = [
  "Menos planillas dispersas y mas contexto accionable.",
  "Alertas antes de que el gasto rompa el presupuesto.",
  "Metas, obligaciones y rutinas en el mismo mapa diario.",
  "Arquitectura lista para premium, admin y Mercado Pago real.",
];

export function BenefitsSection() {
  return (
    <section className="border-y border-budget-border bg-budget-surface px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Beneficios</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Pensado para uso cotidiano y escala real.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="rounded-lg border border-budget-border bg-budget-card p-5 text-sm leading-6 text-budget-muted">
              {benefit}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const innovations = ["Budgetly Pulse", "Smart Inbox", "Simulador de decisiones", "Extraccion mock desde fotos"];

export function InnovationSection() {
  return (
    <section className="bg-budget-bg px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Innovacion</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Funciones propias para decisiones reales.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {innovations.map((item) => (
            <div key={item} className="rounded-lg border border-budget-border bg-budget-card p-5 text-sm font-semibold text-budget-text">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

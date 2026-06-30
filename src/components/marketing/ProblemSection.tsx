export function ProblemSection() {
  return (
    <section className="bg-budget-bg px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Problema</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">La vida financiera no vive en una sola planilla.</h2>
        </div>
        <p className="text-sm leading-7 text-budget-muted">
          Gastos, horarios, obligaciones, tickets, metas, Mercado Pago y decisiones aparecen todos los dias en lugares distintos. Budgetly los ordena como sistema, no como lista suelta.
        </p>
      </div>
    </section>
  );
}

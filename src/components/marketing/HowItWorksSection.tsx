const steps = [
  "Carga movimientos o sincroniza Mercado Pago mock.",
  "Subi tickets o comprobantes al asistente.",
  "Confirma datos extraidos antes de guardarlos.",
  "Revisa Pulse, Inbox, Timeline y decisiones.",
];

export function HowItWorksSection() {
  return (
    <section className="border-y border-budget-border bg-budget-surface px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Como funciona</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">De datos dispersos a acciones claras.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step} className="rounded-lg border border-budget-border bg-budget-card p-5">
              <p className="text-sm font-semibold text-budget-neon">0{index + 1}</p>
              <p className="mt-3 text-sm leading-6 text-budget-muted">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

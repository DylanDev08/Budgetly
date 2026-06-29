const questions = [
  ["Budgetly invierte por mi?", "No. El modulo de inversiones es educativo y no ejecuta operaciones."],
  ["Puedo usar Mercado Pago?", "Si. Hoy hay sync mock y la arquitectura esta separada para OAuth financiero real."],
  ["El admin ve contrasenas?", "No. Google y Supabase no exponen contrasenas, y Budgetly no debe guardarlas en texto plano."],
  ["Que es Budgetly Pulse?", "Un score interno que resume estabilidad, gasto, obligaciones, metas y ahorro."],
];

export function FAQSection() {
  return (
    <section className="bg-budget-bg px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Preguntas rapidas.</h2>
        </div>
        <div className="grid gap-4">
          {questions.map(([question, answer]) => (
            <article key={question} className="rounded-lg border border-budget-border bg-budget-card p-5">
              <h3 className="font-semibold text-budget-text">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-budget-muted">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ShieldCheck } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="border-y border-budget-border bg-budget-surface px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="w-fit rounded-lg bg-budget-soft p-4 text-budget-neon">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Seguridad</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-budget-text">Autenticacion segura y datos separados por usuario.</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-budget-muted">
            Budgetly usa Supabase Auth, middleware SSR, Prisma, validaciones Zod y Row Level Security preparada para que cada usuario acceda solo a sus datos.
          </p>
        </div>
      </div>
    </section>
  );
}

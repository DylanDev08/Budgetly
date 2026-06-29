import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="px-5 py-20 sm:px-8">
      <div className="mx-auto rounded-lg border border-budget-border bg-budget-card p-8 text-center shadow-soft">
        <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-normal text-budget-text">
          Empeza con un tablero simple y escala hacia decisiones inteligentes.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-budget-muted">
          Carga tus primeros movimientos, configura metas y deja que Budgetly construya contexto financiero real.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-budget-green px-5 text-sm font-semibold text-budget-bg shadow-glow transition-colors hover:bg-budget-neon"
        >
          Entrar ahora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";

export function PublicFooter() {
  return (
    <footer className="border-t border-budget-border bg-budget-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.7fr_0.7fr]">
        <div>
          <BudgetlyLogo />
          <p className="mt-4 max-w-md text-sm leading-6 text-budget-muted">
            Budgetly es un sistema operativo personal para finanzas, habitos, metas y decisiones inteligentes.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-budget-text">Producto</p>
          <div className="mt-4 grid gap-3 text-sm text-budget-muted">
            <Link href="/features" className="hover:text-budget-neon">Modulos</Link>
            <Link href="/pricing" className="hover:text-budget-neon">Planes</Link>
            <Link href="/security" className="hover:text-budget-neon">Seguridad</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-budget-text">Legal</p>
          <div className="mt-4 grid gap-3 text-sm text-budget-muted">
            <Link href="/legal/terms" className="hover:text-budget-neon">Terminos</Link>
            <Link href="/legal/privacy" className="hover:text-budget-neon">Privacidad</Link>
            <Link href="/legal/security" className="hover:text-budget-neon">Seguridad</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-budget-border px-5 py-4 text-center text-xs text-budget-dim">
        Budgetly. Copyright 2026. Producto fintech personal en desarrollo.
      </div>
    </footer>
  );
}

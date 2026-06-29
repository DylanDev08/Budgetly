import Link from "next/link";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";

export function Footer() {
  return (
    <footer className="border-t border-budget-border bg-budget-surface px-5 py-4 text-sm text-budget-muted sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BudgetlyLogo compact />
          <p>Copyright 2026.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/legal/terms" className="font-medium text-budget-text hover:text-budget-neon">
            Terminos
          </Link>
          <Link href="/legal/privacy" className="font-medium text-budget-text hover:text-budget-neon">
            Privacidad
          </Link>
          <Link href="/legal/security" className="font-medium text-budget-text hover:text-budget-neon">
            Seguridad
          </Link>
          <a href="mailto:contacto@budgetly.app" className="font-medium text-budget-text hover:text-budget-neon">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}

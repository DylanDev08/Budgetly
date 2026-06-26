import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-budget-border bg-white px-5 py-4 text-sm text-budget-muted sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>Budgetly. Copyright 2026.</p>
        <div className="flex items-center gap-4">
          <Link href="/legal/terms" className="font-medium text-budget-dark hover:text-budget-green">
            Terminos y condiciones
          </Link>
          <a href="mailto:contacto@budgetly.app" className="font-medium text-budget-dark hover:text-budget-green">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}

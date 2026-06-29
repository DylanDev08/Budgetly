import Link from "next/link";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";

const links = [
  { href: "/features", label: "Modulos" },
  { href: "/pricing", label: "Planes" },
  { href: "/security", label: "Seguridad" },
  { href: "/contact", label: "Contacto" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-budget-border bg-budget-bg/90 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Ir al inicio">
          <BudgetlyLogo />
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-budget-muted transition-colors hover:text-budget-neon">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden h-10 items-center rounded-lg border border-budget-border bg-budget-card px-4 text-sm font-semibold text-budget-text transition-colors hover:bg-budget-hover sm:inline-flex"
          >
            Ingresar
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex h-10 items-center rounded-lg bg-budget-green px-4 text-sm font-semibold text-budget-bg shadow-glow transition-colors hover:bg-budget-neon"
          >
            Probar Budgetly
          </Link>
        </div>
      </nav>
    </header>
  );
}

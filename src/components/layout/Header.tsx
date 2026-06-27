import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-budget-border bg-budget-bg/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <p className="text-sm font-semibold text-budget-text">Panel personal</p>
          <p className="hidden text-xs text-budget-muted sm:block">Control financiero privado y modular</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge tone="success" className="hidden sm:inline-flex">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          Modo seguro
        </Badge>
        <Link
          href="/auth/login"
          className="hidden h-10 items-center justify-center rounded-lg border border-budget-border bg-budget-card px-4 text-sm font-medium text-budget-text transition-colors hover:bg-budget-hover sm:inline-flex"
        >
          Ingresar
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-budget-green px-4 text-sm font-semibold text-budget-bg shadow-glow transition-colors hover:bg-budget-neon"
        >
          Crear cuenta
        </Link>
      </div>
    </header>
  );
}

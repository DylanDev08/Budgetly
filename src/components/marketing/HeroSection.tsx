import Link from "next/link";
import { ArrowRight, ShieldCheck, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-budget-border bg-budget-bg">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-7">
          <Badge tone="success" className="w-fit">
            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
            Sistema financiero personal seguro
          </Badge>
          <div className="grid gap-5">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-budget-text sm:text-6xl">
              Budgetly no solo registra tus gastos: entiende tu vida financiera.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-budget-muted sm:text-lg">
              Un command center para controlar dinero, obligaciones, metas, habitos, Mercado Pago, inversiones educativas y decisiones cotidianas.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth/login"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-budget-green px-5 text-sm font-semibold text-budget-bg shadow-glow transition-colors hover:bg-budget-neon"
            >
              Entrar a Budgetly
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex h-11 items-center rounded-lg border border-budget-border bg-budget-card px-5 text-sm font-semibold text-budget-text transition-colors hover:bg-budget-hover"
            >
              Ver modulos
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-budget-border bg-budget-card p-5 shadow-soft">
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface p-4">
              <div>
                <p className="text-sm text-budget-muted">Budgetly Pulse</p>
                <p className="mt-1 text-3xl font-semibold text-budget-text">82</p>
              </div>
              <div className="rounded-full bg-budget-soft p-3 text-budget-neon">
                <WalletCards className="h-6 w-6" />
              </div>
            </div>
            {[
              ["Balance estimado", "+ $128.400"],
              ["Proxima obligacion", "Internet, dia 10"],
              ["Meta prioritaria", "Fondo de emergencia"],
              ["Accion sugerida", "Revisar comida / delivery"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-budget-border bg-budget-surface p-4">
                <span className="text-sm text-budget-muted">{label}</span>
                <span className="text-sm font-semibold text-budget-text">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

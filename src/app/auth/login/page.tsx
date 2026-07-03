import { redirect } from "next/navigation";
import { ArrowRight, Bot, CreditCard, Gauge, ShieldCheck, WalletCards } from "lucide-react";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";
import { Badge } from "@/components/ui/Badge";
import { LoginForm } from "@/features/auth/LoginForm";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const profile = await ensureProfile(user);
    redirect(profile.role === "admin" ? "/admin" : "/dashboard");
  }

  const modules = [
    { label: "Movimientos", icon: WalletCards, detail: "Carga gastos e ingresos sin perder contexto" },
    { label: "Presupuestos", icon: Gauge, detail: "Alertas antes de pasarte del limite" },
    { label: "Mercado Pago", icon: CreditCard, detail: "Importacion y control desde backend" },
    { label: "Asistente", icon: Bot, detail: "Ayuda simple usando tus datos reales" },
  ];

  return (
    <main className="min-h-screen bg-budget-bg px-5 py-8 text-budget-text">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="grid gap-8">
          <BudgetlyLogo />
          <div className="grid gap-5">
            <Badge tone="success" className="w-fit">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Acceso seguro con Supabase Auth
            </Badge>
            <div className="grid gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-budget-text sm:text-5xl">
                Tu dinero diario, entendido en un panel simple.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-budget-muted">
                Budgetly convierte movimientos, presupuestos, metas y obligaciones en decisiones claras: que pagar, cuanto gastar y cuando frenar.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <div key={module.label} className="rounded-lg border border-budget-border bg-budget-card p-4 transition-colors hover:bg-budget-hover">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-budget-soft p-2 text-budget-neon">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-budget-text">{module.label}</p>
                      <p className="mt-1 text-sm text-budget-muted">{module.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-budget-muted">
            {["Gastos por categoria", "Metas y obligaciones", "Admin con auditoria", "RLS por usuario"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full border border-budget-border bg-budget-surface px-3 py-2">
                <ArrowRight className="h-3.5 w-3.5 text-budget-neon" />
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-budget-text">Ingresar a Budgetly</h2>
            <p className="mt-2 text-sm leading-6 text-budget-muted">Un solo acceso, perfiles por rol y sesion protegida.</p>
          </div>
          <LoginForm error={params?.error} />
        </section>
      </div>
    </main>
  );
}

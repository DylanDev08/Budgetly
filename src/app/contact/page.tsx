import { Mail } from "lucide-react";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";

export default function ContactPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg px-5 py-20 text-budget-text sm:px-8">
        <section className="mx-auto grid max-w-4xl gap-6 rounded-lg border border-budget-border bg-budget-card p-8">
          <div className="w-fit rounded-lg bg-budget-soft p-3 text-budget-neon">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Contacto</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal text-budget-text">Hablemos de Budgetly.</h1>
            <p className="mt-4 text-sm leading-6 text-budget-muted">
              Para soporte, feedback o consultas del producto, escribi a contacto@budgetly.app.
            </p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

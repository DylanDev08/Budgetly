import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";
import { SecuritySection } from "@/components/marketing/SecuritySection";

export default function SecurityPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg text-budget-text">
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Seguridad</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-budget-text">
              Arquitectura segura para una app financiera personal.
            </h1>
          </div>
        </section>
        <SecuritySection />
      </main>
      <PublicFooter />
    </>
  );
}

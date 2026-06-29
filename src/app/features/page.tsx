import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";

export default function FeaturesPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg text-budget-text">
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Modulos</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-budget-text">
              La arquitectura de Budgetly combina gestion, inteligencia y rutina diaria.
            </h1>
          </div>
        </section>
        <FeatureSection />
        <BenefitsSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </>
  );
}

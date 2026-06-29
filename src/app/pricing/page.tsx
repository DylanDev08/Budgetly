import { FinalCTA } from "@/components/marketing/FinalCTA";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";

export default function PricingPage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg text-budget-text">
        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-budget-neon">Planes</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-budget-text">
              Empeza gratis y escala cuando necesites mas inteligencia financiera.
            </h1>
          </div>
        </section>
        <PricingPreview />
        <FinalCTA />
      </main>
      <PublicFooter />
    </>
  );
}

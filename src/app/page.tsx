import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FeatureSection } from "@/components/marketing/FeatureSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { HeroSection } from "@/components/marketing/HeroSection";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";
import { SecuritySection } from "@/components/marketing/SecuritySection";

const metrics = [
  ["8", "modulos conectados"],
  ["100%", "dark fintech"],
  ["0", "inversiones automaticas"],
  ["24h", "sesion protegida"],
];

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg text-budget-text">
        <HeroSection />
        <section className="border-b border-budget-border bg-budget-surface px-5 py-10 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map(([value, label]) => (
              <div key={label} className="rounded-lg border border-budget-border bg-budget-card p-5">
                <p className="text-3xl font-semibold text-budget-text">{value}</p>
                <p className="mt-2 text-sm text-budget-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>
        <FeatureSection />
        <BenefitsSection />
        <PricingPreview />
        <SecuritySection />
        <FAQSection />
        <FinalCTA />
      </main>
      <PublicFooter />
    </>
  );
}

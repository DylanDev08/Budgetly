import { BenefitsSection } from "@/components/marketing/BenefitsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { InnovationSection } from "@/components/marketing/InnovationSection";
import { MetricStrip } from "@/components/marketing/MetricStrip";
import { ModulesSection } from "@/components/marketing/ModulesSection";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { PublicFooter } from "@/components/marketing/PublicFooter";
import { PublicNavbar } from "@/components/marketing/PublicNavbar";
import { SecuritySection } from "@/components/marketing/SecuritySection";
import { SolutionSection } from "@/components/marketing/SolutionSection";

export default function HomePage() {
  return (
    <>
      <PublicNavbar />
      <main className="bg-budget-bg text-budget-text">
        <HeroSection />
        <MetricStrip />
        <ProblemSection />
        <SolutionSection />
        <ModulesSection />
        <InnovationSection />
        <HowItWorksSection />
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

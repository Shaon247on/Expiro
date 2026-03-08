import BrandMarquee from "@/components/landing/BrandSection";
import ExpiroSection from "@/components/landing/ExpiroSection";
import HeroSection from "@/components/landing/HeroSection";
import ManagementSection from "@/components/landing/Managementsection";
import PricingSection from "@/components/landing/Pricingsection";
import ProfessionalSection from "@/components/landing/ProfessionalSection";
import TheProblemSection from "@/components/landing/TheProblemSection";
import TheSolutionSection from "@/components/landing/TheSolutionSection";
import TrustBySection from "@/components/landing/TrustBySection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BrandMarquee />
      <ExpiroSection/>
      <TrustBySection/>
      <TheProblemSection/>
      <TheSolutionSection/>
      <ProfessionalSection/>
      <PricingSection/>
      <ManagementSection/>
      {/* Placeholder for remaining sections */}
      {/* <div className="h-[200vh] bg-linear-to-b from-[#F7FCF9] to-white" /> */}
    </main>
  );
}

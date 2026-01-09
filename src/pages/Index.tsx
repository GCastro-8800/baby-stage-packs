import { useRef, useState } from "react";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import PricingSection from "@/components/PricingSection";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import Footer from "@/components/Footer";

const Index = () => {
  const pricingRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    // Track pricing click (for analytics)
    console.log("Pricing click:", plan);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onSeePricing={scrollToPricing} />
      <ProblemSection />
      <SolutionSection />
      <PricingSection onSelectPlan={handleSelectPlan} pricingRef={pricingRef} />
      <Footer />

      <EmailCaptureModal
        isOpen={isModalOpen}
        selectedPlan={selectedPlan}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;

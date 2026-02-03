import { useRef, useState, useEffect } from "react";
import Hero from "@/components/Hero";
import HowItWorksSection from "@/components/HowItWorksSection";
import MissionSection from "@/components/MissionSection";
import ComparisonSection from "@/components/ComparisonSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EmailCaptureModal from "@/components/EmailCaptureModal";
import Footer from "@/components/Footer";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { track } = useAnalytics();

  // Track page view on mount
  useEffect(() => {
    track("page_view", { page: "landing" });
  }, [track]);
  
  const pricingRef = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    console.log("Pricing click:", plan);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onSeePricing={scrollToPricing} />
      <HowItWorksSection />
      <MissionSection />
      <ComparisonSection />
      <PricingSection onSelectPlan={handleSelectPlan} pricingRef={pricingRef} />
      <FAQSection />
      <TestimonialsSection />
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

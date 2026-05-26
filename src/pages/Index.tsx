import { useEffect } from "react";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandLogosSection from "@/components/BrandLogosSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MissionSection from "@/components/MissionSection";
import ComparisonSection from "@/components/ComparisonSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PaolaConsultationSection from "@/components/PaolaConsultationSection";
import ManifestoBand from "@/components/ManifestoBand";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { track } = useAnalytics();

  useEffect(() => {
    track("page_view", { page: "landing" });
  }, [track]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <SEO
        title="bebloo — Equipamiento premium de bebé en alquiler"
        description="Alquila el mejor equipamiento para tu bebé: cochecitos, cunas y más de marcas premium. Sin acumular, sin compromiso largo. Desde 48€/mes."
        path="/"
      />
      <Header />
      <Hero />
      <div className="reveal"><BrandLogosSection /></div>
      <div className="reveal"><HowItWorksSection /></div>
      <div className="reveal"><MissionSection /></div>
      <div className="reveal"><ComparisonSection /></div>
      <div className="reveal"><PaolaConsultationSection /></div>
      <div className="reveal"><PricingSection /></div>
      <div className="reveal"><FAQSection /></div>
      <TestimonialsSection />
      <ManifestoBand />
      <Footer />
      <FloatingCTA />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

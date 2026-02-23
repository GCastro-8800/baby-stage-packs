import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandLogosSection from "@/components/BrandLogosSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import MissionSection from "@/components/MissionSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { track } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    track("page_view", { page: "landing" });
  }, [track]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <Hero />
      <BrandLogosSection />
      <HowItWorksSection />
      <MissionSection />
      <ComparisonSection />

      {/* CTA Section — invites to configurador */}
      <section className="py-16 px-4 md:py-24 md:px-6 bg-primary/10">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-serif text-foreground mb-4">
            Tu equipamiento, curado por expertos
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Responde 4 preguntas y te recomendamos exactamente lo que necesitas. Sin compromiso.
          </p>
          <Button
            size="lg"
            onClick={() => {
              track("cta_click", { source: "home_cta_section", action: "configurador" });
              navigate("/configurador");
            }}
            className="cta-tension text-base md:text-lg px-8 py-6 h-auto"
          >
            Descubre qué necesitas
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <FAQSection />
      <TestimonialsSection />
      <Footer />
      <FloatingCTA />
      <ChatBot />
      <WhatsAppButton />
    </div>
  );
};

export default Index;

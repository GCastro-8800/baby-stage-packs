import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import logo from "@/assets/logo-bebloo.png";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onSeePricing: () => void;
}

const Hero = ({ onSeePricing }: HeroProps) => {
  const { track } = useAnalytics();

  const handleCtaClick = () => {
    track("cta_click", { source: "hero", action: "see_pricing" });
    onSeePricing();
  };
  return (
    <section className="hero-section min-h-[85vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="container max-w-3xl text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src={logo} 
            alt="bebloo" 
            className="h-24 md:h-32 mx-auto"
          />
        </div>

        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 text-foreground text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Suscripción premium de equipamiento para bebés
        </div>

        {/* Direct headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 text-balance leading-tight">
          Los primeros meses con un bebé ya son suficientemente caóticos.
        </h1>

        {/* Problem-aware subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          Nosotros nos encargamos del equipamiento — limpio, seguro y renovado según crece tu bebé. Sin comprar. Sin almacenar. Sin revender.
        </p>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={handleCtaClick}
          className="cta-tension text-lg px-8 py-6 h-auto"
        >
          Ver planes y precios
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>

        {/* Micro-validation */}
        <p className="mt-6 text-sm text-muted-foreground">
          Desde €89/mes • Etapa 0–3 meses
        </p>
      </div>
    </section>
  );
};

export default Hero;

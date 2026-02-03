import { Button } from "@/components/ui/button";
import { ArrowDown, Check, Star } from "lucide-react";
import logo from "@/assets/logo-bebloo.png";
import { useAnalytics } from "@/hooks/useAnalytics";

interface HeroProps {
  onSeePricing: () => void;
}

const benefits = [
  "Equipamiento premium de marcas top",
  "Limpieza con estándares hospitalarios",
  "Cambio de etapa sin complicaciones",
];

const Hero = ({ onSeePricing }: HeroProps) => {
  const { track } = useAnalytics();

  const handleCtaClick = () => {
    track("cta_click", { source: "hero", action: "see_pricing" });
    onSeePricing();
  };

  return (
    <section className="hero-section min-h-[90vh] flex items-center px-4 py-12 md:px-6 md:py-20">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column - Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Logo */}
            <div className="mb-6">
              <img 
                src={logo} 
                alt="bebloo" 
                className="h-12 md:h-16 mx-auto lg:mx-0"
              />
            </div>

            {/* Trust badge with stars */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/30 text-foreground text-xs md:text-sm font-medium mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-accent text-accent" />
                ))}
              </div>
              <span>50+ familias ya confían en nosotros</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4 md:mb-6 text-balance leading-tight">
              Disfruta de tu bebé. Del equipamiento nos encargamos nosotros.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-lg mx-auto lg:mx-0 text-balance">
              Cunas, hamacas y más — siempre limpios, siempre seguros, renovados cuando tu bebé crece.
            </p>

            {/* Benefits with checkmarks */}
            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-foreground text-sm md:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleCtaClick}
                className="cta-tension text-base md:text-lg px-6 md:px-8 py-5 md:py-6 h-auto"
              >
                Descubre los packs
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Micro-validation */}
            <p className="mt-6 text-sm text-muted-foreground">
              Desde €89/mes • Sin permanencia • Envío incluido
            </p>
          </div>

          {/* Right column - Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-secondary shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&h=750&fit=crop"
                  alt="Familia feliz con su bebé"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-background rounded-2xl shadow-lg p-4 border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Todo incluido</p>
                    <p className="text-xs text-muted-foreground">Entrega + recogida</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

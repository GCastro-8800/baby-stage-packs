import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-premium.jpg";
import { useAnalytics } from "@/hooks/useAnalytics";

const Hero = () => {
  const { track } = useAnalytics();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    track("cta_click", { source: "hero", action: "configurador" });
    navigate("/configurador");
  };

  const scrollToHow = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-section min-h-[auto] lg:min-h-[88vh] flex items-center px-4 pt-24 pb-16 md:px-6 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left column — content */}
          <div className="order-2 lg:order-1 lg:col-span-6 text-center lg:text-left reveal">
            <p className="eyebrow mb-6">Equipamiento de bebé · en alquiler</p>

            <h1 className="font-serif text-foreground text-balance mb-6"
                style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', fontWeight: 400, letterSpacing: '-0.02em' }}>
              Lo mejor para tu bebé,<br className="hidden md:block" /> sin acumularlo en casa.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Equipamiento premium en alquiler. Cambia, devuelve y olvídate de revender.
              Sin permanencia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleCtaClick}
                className="cta-tension text-base px-8 py-6 h-auto rounded-full"
              >
                Empieza tu selección
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <button
                onClick={scrollToHow}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Cómo funciona →
              </button>
            </div>
          </div>

          {/* Right column — image */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center lg:justify-end reveal">
            <div className="relative w-full max-w-md lg:max-w-xl">
              <div className="aspect-[4/5] rounded-md overflow-hidden bg-secondary shadow-quiet">
                <img
                  src={heroImage}
                  alt="Madre con cochecito premium en alquiler — bebloo"
                  className="w-full h-full object-cover"
                  width={1024}
                  height={1280}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-band: discreet trust strip */}
        <div className="mt-14 md:mt-20 pt-8 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-between gap-x-10 gap-y-3 text-xs text-muted-foreground reveal">
          <span className="tracking-wide">Sin permanencia</span>
          <span className="tracking-wide">Envío y recogida incluidos</span>
          <span className="tracking-wide">Cambia el material cuando quieras</span>
          <span className="tracking-wide">Limpieza con estándares hospitalarios</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;

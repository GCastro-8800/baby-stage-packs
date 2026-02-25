import { useNavigate } from "react-router-dom";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

const benefits = [
  { icon: Truck, text: "Entrega y recogida a domicilio" },
  { icon: RefreshCw, text: "Cambios cuando el bebé crece" },
  { icon: ShieldCheck, text: "Limpieza profesional certificada" },
  { icon: Sparkles, text: "Sin permanencia — cancela cuando quieras" },
];

const PricingSection = () => {
  const { track } = useAnalytics();
  const navigate = useNavigate();

  return (
    <section id="precios" className="py-16 px-4 md:py-24 md:px-6 bg-warm scroll-mt-20">
      <div className="container max-w-3xl text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wide uppercase mb-4">
          Precios
        </span>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
          Paga solo por lo que necesitas
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Elige los productos de nuestro catálogo y el precio se calcula automáticamente. Más meses, más ahorro.
        </p>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 gap-4 mb-10 max-w-lg mx-auto">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-left">
              <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          onClick={() => {
            track("cta_click", { source: "pricing_section", action: "catalogo" });
            navigate("/catalogo");
          }}
          className="cta-tension text-base md:text-lg px-8 py-6 h-auto"
        >
          Explorar catálogo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs text-muted-foreground mt-6">
          Ahorra hasta un 20 % con suscripciones de 12 meses. Sin permanencia.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

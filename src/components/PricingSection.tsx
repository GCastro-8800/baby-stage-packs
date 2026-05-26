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
    <section id="precios" className="py-24 md:py-36 px-4 md:px-6 scroll-mt-20">
      <div className="container max-w-3xl text-center">
        <p className="eyebrow mb-6">Precios</p>
        <h2 className="font-serif text-foreground mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400 }}>
          Paga solo por lo que necesitas
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-14">
          Elige los productos de nuestro catálogo y el precio se calcula automáticamente. Más meses, más ahorro.
        </p>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5 mb-14 max-w-xl mx-auto">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-4 text-left">
              <Icon className="h-4 w-4 text-accent shrink-0" strokeWidth={1.5} />
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
          className="cta-tension text-base md:text-lg px-8 py-6 h-auto rounded-full"
        >
          Explorar catálogo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-xs text-muted-foreground mt-8 tracking-wide">
          Ahorra hasta un 20 % eligiendo 12 meses por producto. Sin permanencia.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

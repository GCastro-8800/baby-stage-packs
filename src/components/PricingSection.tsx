import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
  pricingRef: React.RefObject<HTMLElement>;
}

const plans = [
  {
    id: "essential",
    name: "Esencial",
    price: 89,
    description: "Para empezar con calma",
    features: [
      "Moisés o cuna",
      "Monitor de bebé",
      "Cambiador",
      "Cambio de etapa incluido",
      "Entrega y recogida gratis",
    ],
    highlighted: false,
  },
  {
    id: "comfort",
    name: "Confort",
    price: 139,
    description: "El equilibrio perfecto",
    features: [
      "Todo lo de Esencial",
      "Hamaca o columpio",
      "Alfombra de juegos",
      "Máquina de ruido blanco",
      "Soporte prioritario",
    ],
    highlighted: true,
  },
  {
    id: "full-peace",
    name: "Tranquilidad Total",
    price: 199,
    description: "Todo resuelto, desde el primer día",
    features: [
      "Todo lo de Confort",
      "Cochecito premium",
      "Silla de coche (0-13kg)",
      "Portabebés",
      "Línea de soporte 24/7",
    ],
    highlighted: false,
  },
];

const PricingSection = ({ onSelectPlan, pricingRef }: PricingSectionProps) => {
  const { track } = useAnalytics();

  const handleSelectPlan = (planName: string) => {
    track("pricing_click", { plan: planName });
    onSelectPlan(planName);
  };

  // Reorder plans for mobile: highlighted first
  const orderedPlans = [...plans].sort((a, b) => {
    if (a.highlighted) return -1;
    if (b.highlighted) return 1;
    return 0;
  });

  return (
    <section id="precios" ref={pricingRef} className="py-16 px-4 md:py-24 md:px-6 bg-warm scroll-mt-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wide uppercase mb-4">
            Planes y precios
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            Elige lo que necesitas
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Todos los planes incluyen la etapa 0–3 meses. Renueva a la siguiente etapa cuando estés listo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {orderedPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${
                plan.highlighted
                  ? "bg-background border-primary md:scale-[1.03]"
                  : "bg-background border-border hover:border-primary/40"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Más elegido
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4 md:mb-6">
                <span className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                  €{plan.price}
                </span>
                <span className="text-muted-foreground">/mes</span>
              </div>

              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full h-12 ${
                  plan.highlighted ? "cta-tension" : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                Seleccionar {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs md:text-sm text-muted-foreground mt-6 md:mt-8">
          Sin permanencia. Si no te convence, cancelas y recogemos todo.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

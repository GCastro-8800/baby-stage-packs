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
    description: "Lo básico, bien hecho",
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
    description: "La opción más popular",
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
    description: "Confianza completa",
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

  return (
    <section ref={pricingRef} className="py-20 px-6 bg-card scroll-mt-8">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Elige tu pack
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Todos los planes incluyen la etapa 0–3 meses. Renueva a la siguiente etapa cuando estés listo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-xl border-2 transition-all ${
                plan.highlighted
                  ? "pricing-highlight scale-[1.02]"
                  : "bg-background border-border hover:border-primary/30"
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

              <div className="mb-6">
                <span className="text-4xl font-serif font-bold text-foreground">
                  €{plan.price}
                </span>
                <span className="text-muted-foreground">/mes</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full ${
                  plan.highlighted ? "cta-tension" : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                Seleccionar {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Sin compromiso. Cancela cuando quieras. Equipamiento devuelto al final de la suscripción.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

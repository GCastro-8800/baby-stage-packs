import { Check, X, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
  pricingRef: React.RefObject<HTMLElement>;
}

type FeatureItem = {
  text: string;
  tooltip?: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  equipment: FeatureItem[];
  services: FeatureItem[];
  excludes?: FeatureItem[];
  bonus?: FeatureItem;
  guarantee: string;
  highlighted: boolean;
};

const plans: Plan[] = [
  {
    id: "start",
    name: "BEBLOO Start",
    price: 59,
    duration: "30 días",
    description: "Una opción básica para probar el servicio durante el inicio.",
    equipment: [
      { text: "Carrito básico" },
      { text: "Cuna o minicuna" },
      { text: "Cambiador" },
      { text: "Monitor de bebé solo audio" },
    ],
    services: [
      { text: "Entrega a domicilio" },
      { text: "Recogida al finalizar el periodo" },
    ],
    excludes: [
      { text: "Montaje en casa" },
      { text: "Cambios automáticos por etapas" },
      { text: "Bonos" },
      { text: "Kit SOS Primeras Noches", tooltip: "Pack extra para las primeras semanas: ruido blanco, aspirador nasal, hamaca portátil extra, mochila recién nacido, pack emergencia y guía digital. No sustituye la hamaca principal." },
      { text: "Gestor personal", tooltip: "Una persona de Bebloo que conoce tu caso, gestiona entregas, retiradas y cambios. Tu único punto de contacto." },
      { text: "Soporte prioritario" },
    ],
    guarantee: "30 días. Puedes cancelar y Bebloo recoge el equipamiento.",
    highlighted: false,
  },
  {
    id: "comfort",
    name: "BEBLOO Comfort",
    price: 129,
    duration: "Sin permanencia",
    description: "Todo el equipamiento esencial, entregado y cambiado por etapas según su crecimiento.",
    equipment: [
      { text: "Carrito completo (capazo + silla)" },
      { text: "Cuna o minicuna" },
      { text: "Trona evolutiva" },
      { text: "Hamaca ergonómica" },
      { text: "Mochila portabebé" },
      { text: "Monitor de bebé" },
      { text: "Cambiador" },
      { text: "Parque de juegos (a partir de la etapa correspondiente)" },
    ],
    services: [
      { text: "Entrega a domicilio" },
      { text: "Montaje en casa" },
      { text: "Recogida del equipamiento que ya no se usa" },
      { text: "Cambios incluidos cuando el bebé crece", tooltip: "El equipamiento evoluciona con el bebé: se retira lo que ya no usa y se entrega lo siguiente, sin costes extra." },
      { text: "Limpieza profesional certificada", tooltip: "Todo el equipamiento se limpia, desinfecta y revisa antes de llegar a tu casa." },
      { text: "Sistema Anti-Acumulación™", tooltip: "Bebloo retira lo que el bebé ya no usa. Solo tienes en casa lo que necesita hoy." },
      { text: "Soporte por WhatsApp" },
    ],
    bonus: {
      text: "Kit SOS Primeras Noches",
      tooltip: "Pack extra para las primeras semanas: ruido blanco, aspirador nasal, hamaca portátil extra, mochila recién nacido, pack emergencia y guía digital. No sustituye la hamaca principal.",
    },
    guarantee: "60 días. Si no te aporta tranquilidad o reduce tu estrés, cancelas y Bebloo recoge todo sin coste.",
    highlighted: true,
  },
  {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 149,
    duration: "Sin permanencia",
    description: "Todo lo de Comfort más un nivel máximo de delegación y personalización.",
    equipment: [
      { text: "Todo el equipamiento de Comfort" },
      { text: "Adaptación continua según necesidades del bebé y la familia" },
    ],
    services: [
      { text: "Gestor personal asignado", tooltip: "Una persona de Bebloo que conoce tu caso, gestiona entregas, retiradas y cambios. Tu único punto de contacto." },
      { text: "Cambios ilimitados de equipamiento, sin justificar" },
      { text: "Servicio hogar ampliado: retirada y reorganización para liberar espacio" },
      { text: "Prioridad en soporte y gestión" },
    ],
    bonus: {
      text: "Kit SOS Primeras Noches",
      tooltip: "Pack extra para las primeras semanas: ruido blanco, aspirador nasal, hamaca portátil extra, mochila recién nacido, pack emergencia y guía digital. No sustituye la hamaca principal.",
    },
    guarantee: "90 días. Si después de tres meses la carga mental no se reduce, cancelas y Bebloo recoge todo.",
    highlighted: false,
  },
];

// Desktop: Start, Comfort (center), Total Peace. Mobile: Comfort first.
const desktopPlans = plans; // already in order: start, comfort, total-peace
const mobilePlans = [...plans].sort((a, b) => {
  if (a.highlighted) return -1;
  if (b.highlighted) return 1;
  return 0;
});

const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Info className="inline h-3.5 w-3.5 text-muted-foreground cursor-help ml-1 flex-shrink-0" />
    </TooltipTrigger>
    <TooltipContent className="max-w-xs text-xs leading-relaxed">
      {text}
    </TooltipContent>
  </Tooltip>
);

const FeatureRow = ({ item, icon }: { item: FeatureItem; icon: "check" | "x" }) => (
  <li className="flex items-start gap-2 text-sm">
    {icon === "check" ? (
      <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
    )}
    <span className="text-foreground flex items-center flex-wrap">
      {item.text}
      {item.tooltip && <InfoTooltip text={item.tooltip} />}
    </span>
  </li>
);

const PricingSection = ({ onSelectPlan, pricingRef }: PricingSectionProps) => {
  const { track } = useAnalytics();

  const handleSelectPlan = (planName: string) => {
    track("pricing_click", { plan: planName });
    onSelectPlan(planName);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <section id="precios" ref={pricingRef} className="py-16 px-4 md:py-24 md:px-6 bg-warm scroll-mt-20">
        <div className="container max-w-6xl">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-semibold tracking-wide uppercase mb-4">
              Planes y precios
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
              Elige lo que necesitas
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              Todos los planes incluyen equipamiento para el primer año. Renueva o cancela cuando quieras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {orderedPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col p-6 md:p-8 rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${
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

                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-3xl md:text-4xl font-serif font-bold text-foreground">€{plan.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
                <p className="text-xs text-muted-foreground mb-5">{plan.duration}</p>

                {/* Equipment */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Equipamiento</h4>
                  <ul className="space-y-2">
                    {plan.equipment.map((item, i) => (
                      <FeatureRow key={i} item={item} icon="check" />
                    ))}
                  </ul>
                </div>

                {/* Services */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Servicios</h4>
                  <ul className="space-y-2">
                    {plan.services.map((item, i) => (
                      <FeatureRow key={i} item={item} icon="check" />
                    ))}
                  </ul>
                </div>

                {/* Excludes */}
                {plan.excludes && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-destructive/70 mb-2">No incluye</h4>
                    <ul className="space-y-2">
                      {plan.excludes.map((item, i) => (
                        <FeatureRow key={i} item={item} icon="x" />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bonus */}
                {plan.bonus && (
                  <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <p className="text-sm font-medium text-foreground flex items-center flex-wrap">
                      🎁 Bono: {plan.bonus.text}
                      {plan.bonus.tooltip && <InfoTooltip text={plan.bonus.tooltip} />}
                    </p>
                  </div>
                )}

                {/* Guarantee */}
                <div className="flex items-start gap-2 mb-6 mt-auto pt-4">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{plan.guarantee}</p>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full h-12 ${plan.highlighted ? "cta-tension" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Seleccionar {plan.name.replace("BEBLOO ", "")}
                </Button>
              </div>
            ))}
          </div>

          <p className="text-center text-xs md:text-sm text-muted-foreground mt-6 md:mt-8">
            Sin permanencia en Comfort y Total Peace. Cancela cuando quieras.
          </p>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default PricingSection;

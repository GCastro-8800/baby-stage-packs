import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onSelectPlan: (plan: string) => void;
  pricingRef: React.RefObject<HTMLElement>;
}

const plans = [
  {
    id: "essential",
    name: "Essential",
    price: 89,
    description: "The basics, done right",
    features: [
      "Bassinet or crib",
      "Baby monitor",
      "Changing mat",
      "Stage swap included",
      "Free delivery & pickup",
    ],
    highlighted: false,
  },
  {
    id: "comfort",
    name: "Comfort",
    price: 139,
    description: "Most popular choice",
    features: [
      "Everything in Essential",
      "Bouncer or swing",
      "Play mat",
      "White noise machine",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    id: "full-peace",
    name: "Full Peace of Mind",
    price: 199,
    description: "Complete confidence",
    features: [
      "Everything in Comfort",
      "Premium stroller",
      "Car seat (0-13kg)",
      "Carrier wrap",
      "24/7 support line",
    ],
    highlighted: false,
  },
];

const PricingSection = ({ onSelectPlan, pricingRef }: PricingSectionProps) => {
  return (
    <section ref={pricingRef} className="py-20 px-6 bg-card scroll-mt-8">
      <div className="container max-w-5xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Choose your pack
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            All plans include the 0–3 months stage. Swap to the next stage when ready.
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
                  Most chosen
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
                <span className="text-muted-foreground">/month</span>
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
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full ${
                  plan.highlighted ? "cta-tension" : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                Select {plan.name}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          No commitment. Cancel anytime. Equipment returned at end of subscription.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;

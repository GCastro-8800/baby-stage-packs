import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { PlanData } from "@/data/planEquipment";

interface EquipmentSectionProps {
  plan: PlanData;
  selections: Record<string, boolean>;
  onToggle: (key: string) => void;
  onContinue: () => void;
}

const EquipmentSection = ({ plan, selections, onToggle, onContinue }: EquipmentSectionProps) => (
  <section className="space-y-8">
    <div className="text-center max-w-lg mx-auto">
      <h2 className="text-xl md:text-2xl font-serif text-foreground mb-2">
        Tu equipamiento en {plan.name}
      </h2>
      <p className="text-sm text-muted-foreground">
        Estos son los modelos disponibles en tu plan. Marca los que más te interesan para que podamos preparar tu asesoramiento.
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1 italic">
        La selección es orientativa. Tu asesor personal te ayudará a elegir.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {plan.equipment.map((cat) => (
        <div key={cat.category} className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-semibold text-foreground mb-3">{cat.category}</h4>
          <ul className="space-y-2.5">
            {cat.options.map((opt) => {
              const key = `${cat.category}::${opt.brand} ${opt.model}`;
              return (
                <li key={key} className="flex items-center gap-2.5">
                  <Checkbox
                    id={key}
                    checked={!!selections[key]}
                    onCheckedChange={() => onToggle(key)}
                  />
                  <label htmlFor={key} className="text-sm cursor-pointer select-none">
                    <span className="font-medium text-foreground">{opt.brand}</span>{" "}
                    <span className="text-muted-foreground">{opt.model}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>

    {plan.upgradePlanId && (
      <p className="text-center text-sm text-muted-foreground">
        ¿Necesitas hamaca, portabebé o más?{" "}
        <Link
          to={`/plan/${plan.upgradePlanId}`}
          className="text-primary font-medium hover:underline inline-flex items-center gap-1"
        >
          Descubre {plan.upgradePlanName} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    )}

    <div className="flex justify-center">
      <Button size="lg" className="cta-tension" onClick={onContinue}>
        Continuar <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  </section>
);

export default EquipmentSection;

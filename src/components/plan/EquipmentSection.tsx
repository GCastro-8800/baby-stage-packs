import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { PlanData, EquipmentOption } from "@/data/planEquipment";
import ProductPreviewDialog from "./ProductPreviewDialog";

interface EquipmentSectionProps {
  plan: PlanData;
  selections: Record<string, boolean>;
  onToggle: (key: string) => void;
  onContinue: () => void;
}

const EquipmentSection = ({ plan, selections, onToggle, onContinue }: EquipmentSectionProps) => {
  const hasAnySelected = (category: string) =>
    plan.equipment
      .find((c) => c.category === category)
      ?.options.some((opt) => selections[`${category}::${opt.brand} ${opt.model}`]);

  return (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {plan.equipment.map((cat) => {
          const catSelected = hasAnySelected(cat.category);
          return (
            <div
              key={cat.category}
              className={`rounded-xl border-2 bg-card p-6 sm:p-8 transition-all ${
                catSelected
                  ? "border-primary/50 shadow-sm"
                  : "border-border hover:border-border/80"
              }`}
            >
              <h4 className="font-semibold text-foreground mb-5 text-base">{cat.category}</h4>
              <ul className="space-y-1">
                {cat.options.map((opt) => {
                  const key = `${cat.category}::${opt.brand} ${opt.model}`;
                  const isSelected = !!selections[key];
                  return (
                    <li
                      key={key}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                      onClick={() => onToggle(key)}
                    >
                      <Checkbox
                        id={key}
                        checked={isSelected}
                        onCheckedChange={() => onToggle(key)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label htmlFor={key} className="text-base cursor-pointer select-none leading-tight">
                        <span className="font-medium text-foreground">{opt.brand}</span>{" "}
                        <span className="text-muted-foreground">{opt.model}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
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
};

export default EquipmentSection;

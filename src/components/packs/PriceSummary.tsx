import { CheckCircle, AlertTriangle } from "lucide-react";
import type { EquipmentOption } from "@/data/planEquipment";

interface PriceSummaryProps {
  packPrice: number;
  allProducts: EquipmentOption[];
  selectedKeys: Set<string>;
  allKeys: string[];
  calculatedPackTotal?: number; // Dynamic total based on selected brands
}

const PriceSummary = ({ packPrice, allProducts, selectedKeys, allKeys, calculatedPackTotal }: PriceSummaryProps) => {
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));
  const noneSelected = selectedKeys.size === 0;

  const individualTotal = allProducts
    .filter((_, i) => selectedKeys.has(allKeys[i]))
    .reduce((sum, p) => sum + (p.precio_individual || 0), 0);

  const displayPackTotal = calculatedPackTotal ?? packPrice;
  const diff = individualTotal - displayPackTotal;

  if (noneSelected) {
    return (
      <div className="rounded-xl border-2 border-border bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">Selecciona al menos un producto</p>
      </div>
    );
  }

  if (allSelected) {
    return (
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 flex items-center justify-center gap-3">
        <CheckCircle className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="font-semibold text-foreground text-lg">
            Pack completo {Math.round(displayPackTotal)}&nbsp;€/mes
          </p>
          <p className="text-xs text-muted-foreground">El mejor precio — todo incluido</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 flex items-center justify-center gap-3">
      <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
      <div>
        <p className="font-semibold text-foreground text-lg">
          Productos sueltos {individualTotal}&nbsp;€/mes
        </p>
        <p className="text-xs text-destructive">
          +{diff}&nbsp;€ más caro que el pack completo ({Math.round(displayPackTotal)}&nbsp;€/mes)
        </p>
      </div>
    </div>
  );
};

export default PriceSummary;

import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import type { EquipmentOption } from "@/data/planEquipment";

interface ProductBreakdown {
  name: string;
  precio_individual: number;
  included: boolean;
}

interface StickyPriceFooterProps {
  currentPrice: number;
  packPrice: number;
  isPackComplete: boolean;
  products: ProductBreakdown[];
  onContinue: () => void;
}

const StickyPriceFooter = ({
  currentPrice,
  packPrice,
  isPackComplete,
  products,
  onContinue,
}: StickyPriceFooterProps) => {
  const [open, setOpen] = useState(false);
  const diff = currentPrice - packPrice;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="container max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg text-foreground">
                €{currentPrice.toFixed(0)}/mes
              </p>
              {isPackComplete ? (
                <p className="text-xs font-medium text-primary flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Pack completo — Mejor oferta
                </p>
              ) : (
                <p className="text-xs font-medium text-orange-500 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  +€{diff.toFixed(0)} más caro que pack completo
                </p>
              )}
            </div>
            <Button
              onClick={onContinue}
              className={isPackComplete ? "" : "bg-orange-500 hover:bg-orange-600 text-white"}
            >
              {isPackComplete ? "Continuar" : "Continuar de todas formas"}
            </Button>
          </div>

          <CollapsibleTrigger className="w-full flex items-center justify-center gap-1 pt-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            Ver desglose de precios
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="container max-w-3xl px-4 pb-4">
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
              {products.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  {p.included ? (
                    <span className="text-primary text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Incluido
                    </span>
                  ) : (
                    <span className="text-orange-500 text-xs font-medium">
                      €{p.precio_individual.toFixed(2)}/mes
                    </span>
                  )}
                </div>
              ))}
              {!isPackComplete && (
                <div className="border-t pt-1.5 flex items-center justify-between text-sm font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">€{currentPrice.toFixed(2)}/mes</span>
                </div>
              )}
            </div>
            {!isPackComplete && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Te recomendamos el pack completo por solo €{packPrice}/mes
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default StickyPriceFooter;

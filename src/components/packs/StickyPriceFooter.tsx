import { useState } from "react";
import { CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface ProductBreakdown {
  name: string;
  precio_en_pack: number;
  precio_individual: number;
  included: boolean;
}

interface StickyPriceFooterProps {
  currentPrice: number;
  packPrice: number;
  isPackComplete: boolean;
  selectedCount: number;
  totalCount: number;
  products: ProductBreakdown[];
  serviceFee?: number;
  durationMonths?: number;
  durationDiscount?: number;
  onContinue: () => void;
}

const StickyPriceFooter = ({
  currentPrice,
  packPrice,
  isPackComplete,
  selectedCount,
  totalCount,
  products,
  serviceFee = 0,
  durationMonths = 1,
  durationDiscount = 0,
  onContinue,
}: StickyPriceFooterProps) => {
  const [open, setOpen] = useState(false);
  const diff = currentPrice - packPrice;
  const totalPeriod = currentPrice * durationMonths;
  const showPeriod = durationMonths > 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="container max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              {isPackComplete ? (
                <>
                  <p className="font-bold text-lg text-foreground">
                    Pack Completo: €{Math.round(currentPrice)}/mes
                  </p>
                  <p className="text-xs font-medium text-primary flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {totalCount} productos{showPeriod && ` · ${durationMonths} meses (€${Math.round(totalPeriod)} total)`}
                  </p>
                </>
              ) : (
                <>
                <p className="font-bold text-lg text-foreground">
                  {selectedCount} producto{selectedCount !== 1 ? "s" : ""}: €{currentPrice.toFixed(0)}/mes
                  {showPeriod && <span className="text-sm font-normal text-muted-foreground"> · €{Math.round(totalPeriod)} total</span>}
                </p>
                  {diff > 0 ? (
                    <p className="text-xs font-medium text-orange-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Con pack completo: €{packPrice}/mes por {totalCount} productos
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-orange-500 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Pack completo desde €{packPrice}/mes
                    </p>
                  )}
                </>
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
                  {isPackComplete ? (
                    <span className="text-primary text-xs font-medium flex items-center gap-1">
                      €{p.precio_en_pack.toFixed(2)}/mes <CheckCircle className="h-3 w-3" />
                    </span>
                  ) : p.included ? (
                    <span className="text-orange-500 text-xs font-medium">
                      €{p.precio_individual.toFixed(2)}/mes
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">No incluido</span>
                  )}
                </div>
              ))}
              {serviceFee > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Servicios premium</span>
                  <span className="text-primary text-xs font-medium">
                    €{serviceFee.toFixed(2)}/mes
                  </span>
                </div>
              )}
              <div className="border-t pt-1.5 flex items-center justify-between text-sm font-bold">
                <span>Total</span>
                <span className={isPackComplete ? "text-primary" : "text-orange-500"}>
                  €{currentPrice.toFixed(2)}/mes
                </span>
              </div>
            </div>
            {!isPackComplete && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Te recomendamos el pack completo por solo €{packPrice}/mes — cada producto te sale mucho más barato
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default StickyPriceFooter;

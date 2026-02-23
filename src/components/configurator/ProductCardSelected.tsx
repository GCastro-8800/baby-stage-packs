import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";
import { cn } from "@/lib/utils";

interface ProductCardSelectedProps {
  product: Product;
  alternatives: Product[];
  onSwap: (oldId: string, newProduct: Product) => void;
  onRemove: (productId: string) => void;
}

export default function ProductCardSelected({ product, alternatives, onSwap, onRemove }: ProductCardSelectedProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <Check className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-sm">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.brand}</p>
            </div>
            <span className="text-sm font-semibold whitespace-nowrap">{product.pricePerMonth}€/mes</span>
          </div>
          {product.shortReason && (
            <p className="text-xs text-muted-foreground mt-1">{product.shortReason}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pl-9">
        {alternatives.length > 0 && (
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-muted-foreground">
                Cambiar producto
                <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", open && "rotate-180")} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {alternatives.map((alt) => {
                const diff = alt.pricePerMonth - product.pricePerMonth;
                return (
                  <button
                    key={alt.id}
                    onClick={() => {
                      onSwap(product.id, alt);
                      setOpen(false);
                    }}
                    className="w-full text-left rounded-lg border p-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{alt.name}</p>
                        <p className="text-xs text-muted-foreground">{alt.shortReason}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold">{alt.pricePerMonth}€</p>
                        {diff !== 0 && (
                          <p className={cn("text-xs", diff > 0 ? "text-destructive" : "text-primary-foreground")}>
                            {diff > 0 ? `+${diff}€` : `${diff}€`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs px-2 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(product.id)}
        >
          <X className="h-3 w-3 mr-1" />
          No necesito esto
        </Button>
      </div>
    </div>
  );
}

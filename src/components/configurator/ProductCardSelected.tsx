import { useState } from "react";
import { ChevronDown, Trash2, ArrowLeftRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";
import { cn } from "@/lib/utils";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

interface ProductCardSelectedProps {
  product: Product;
  alternatives: Product[];
  onSwap: (oldId: string, newProduct: Product) => void;
  onRemove: (productId: string) => void;
}

export default function ProductCardSelected({ product, alternatives, onSwap, onRemove }: ProductCardSelectedProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-4 flex gap-4">
        <ProductImagePlaceholder category={product.category} image={product.image} />
        
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-base text-foreground">{product.name}</p>
                <span className="inline-block text-[11px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mt-1">
                  {product.brand}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-block bg-accent/10 text-foreground font-semibold text-sm px-2.5 py-1 rounded-lg">
                  {product.pricePerMonth}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
                </span>
              </div>
            </div>
            {product.shortReason && (
              <p className="text-xs text-primary-foreground/80 bg-primary/15 inline-block px-2 py-0.5 rounded-full mt-2">
                {product.shortReason}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            {alternatives.length > 0 && (
              <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <ArrowLeftRight className="h-3 w-3" />
                    Cambiar
                    <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
            <button
              onClick={() => onRemove(product.id)}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              aria-label={`Quitar ${product.name}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {alternatives.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent>
            <div className="border-t bg-muted/30 p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground mb-2">Alternativas disponibles</p>
              {alternatives.map((alt) => {
                const diff = alt.pricePerMonth - product.pricePerMonth;
                return (
                  <button
                    key={alt.id}
                    onClick={() => { onSwap(product.id, alt); setOpen(false); }}
                    className="w-full text-left rounded-lg border bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all flex gap-3"
                  >
                    <ProductImagePlaceholder category={alt.category} image={alt.image} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{alt.name}</p>
                          <p className="text-xs text-muted-foreground">{alt.brand}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">{alt.pricePerMonth}€</p>
                          {diff !== 0 && (
                            <p className={cn("text-xs font-medium", diff > 0 ? "text-destructive" : "text-primary-foreground")}>
                              {diff > 0 ? `+${diff}€` : `${diff}€`}
                            </p>
                          )}
                        </div>
                      </div>
                      {alt.shortReason && (
                        <p className="text-xs text-muted-foreground mt-1">{alt.shortReason}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

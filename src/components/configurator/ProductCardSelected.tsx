import { useState } from "react";
import { ChevronDown, Trash2, ArrowLeftRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Product } from "@/data/productCatalog";
import { cn } from "@/lib/utils";
import { DURATION_OPTIONS } from "@/lib/constants";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

interface ProductCardSelectedProps {
  product: Product;
  alternatives: Product[];
  onSwap: (oldId: string, newProduct: Product) => void;
  onRemove: (productId: string) => void;
  duration: number;
  onDurationChange: (productId: string, months: number) => void;
  discountedPrice: number;
  onPreview?: (product: Product) => void;
  reasons?: string[];
}

export default function ProductCardSelected({
  product,
  alternatives,
  onSwap,
  onRemove,
  duration,
  onDurationChange,
  discountedPrice,
  onPreview,
  reasons,
}: ProductCardSelectedProps) {
  const [open, setOpen] = useState(false);
  const hasDiscount = discountedPrice < product.pricePerMonth;

  return (
    <article className="border-b border-foreground/10 py-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={onPreview ? "cursor-pointer shrink-0" : "shrink-0"} onClick={() => onPreview?.(product)}>
          <ProductImagePlaceholder category={product.category} image={product.image} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                  {product.brand}
                </p>
                <p
                  className={cn(
                    "font-display text-lg text-foreground mt-1",
                    onPreview && "cursor-pointer hover:opacity-70 transition-opacity"
                  )}
                  onClick={() => onPreview?.(product)}
                >
                  {product.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                {hasDiscount && (
                  <span className="block text-xs text-muted-foreground line-through">
                    {product.pricePerMonth}€
                  </span>
                )}
                <span className="font-display text-xl text-foreground">
                  {discountedPrice}€
                  <span className="text-xs font-sans text-muted-foreground ml-0.5">/mes</span>
                </span>
              </div>
            </div>

            {/* Duration chips */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.months}
                  onClick={() => onDurationChange(product.id, opt.months)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] transition-colors border",
                    duration === opt.months
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-foreground/20 hover:border-foreground/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {product.shortReason && (
              <p className="text-xs text-muted-foreground italic mt-3">
                {product.shortReason}
              </p>
            )}

            {reasons && reasons.length > 0 && (
              <div className="mt-4 border-l border-foreground/20 pl-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                  Por qué te lo recomendamos
                </p>
                <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                  {reasons.map((r, i) => (
                    <li key={i}>· {r}</li>
                  ))}
                </ul>
                {onPreview && (
                  <button
                    type="button"
                    onClick={() => onPreview(product)}
                    className="mt-2 inline-block border-b border-foreground/30 text-xs text-foreground/80 hover:border-foreground transition-colors"
                  >
                    Ver ficha completa
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-1">
            {alternatives.length > 0 && (
              <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 text-xs text-foreground/80 border-b border-foreground/30 pb-0.5 hover:border-foreground transition-colors">
                    <ArrowLeftRight className="h-3 w-3" />
                    Cambiar
                    <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
                  </button>
                </CollapsibleTrigger>
              </Collapsible>
            )}
            <button
              onClick={() => onRemove(product.id)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
              aria-label={`Quitar ${product.name}`}
            >
              <Trash2 className="h-3 w-3" />
              Quitar
            </button>
          </div>
        </div>
      </div>

      {alternatives.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent>
            <div className="mt-4 border-t border-foreground/10 pt-4 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-2">
                Alternativas
              </p>
              {alternatives.map((alt) => {
                const diff = alt.pricePerMonth - product.pricePerMonth;
                return (
                  <button
                    key={alt.id}
                    onClick={() => { onSwap(product.id, alt); setOpen(false); }}
                    className="w-full text-left border-b border-foreground/10 py-3 hover:bg-foreground/5 transition-colors flex gap-3"
                  >
                    <ProductImagePlaceholder category={alt.category} image={alt.image} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                            {alt.brand}
                          </p>
                          <p className="font-display text-base mt-0.5">{alt.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display text-base">{alt.pricePerMonth}€</p>
                          {diff !== 0 && (
                            <p className={cn("text-[11px]", diff > 0 ? "text-destructive" : "text-foreground/70")}>
                              {diff > 0 ? `+${diff}€` : `${diff}€`}
                            </p>
                          )}
                        </div>
                      </div>
                      {alt.shortReason && (
                        <p className="text-xs text-muted-foreground italic mt-1">{alt.shortReason}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </article>
  );
}

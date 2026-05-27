import { Plus, X } from "lucide-react";
import { Product } from "@/data/productCatalog";
import { cn } from "@/lib/utils";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

interface ProductCardSuggestedProps {
  product: Product;
  isSelected: boolean;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  stageBadge?: string;
  onPreview?: (product: Product) => void;
}

export default function ProductCardSuggested({ product, isSelected, onAdd, onRemove, stageBadge, onPreview }: ProductCardSuggestedProps) {
  return (
    <article className={cn(
      "border-b border-foreground/10 py-6 transition-opacity",
      !isSelected && "opacity-90"
    )}>
      <div className="flex gap-4">
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
                <span className="font-display text-xl text-foreground">
                  {product.prices?.[3] ?? product.pricePerMonth}€
                  <span className="text-xs font-sans text-muted-foreground ml-0.5">/mes</span>
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Desde 3 meses</p>
              </div>
            </div>
            {stageBadge && !isSelected && (
              <p className="text-[10px] uppercase tracking-[0.18em] text-foreground/50 mt-2">
                {stageBadge}
              </p>
            )}
            {product.shortReason && (
              <p className="text-xs text-muted-foreground italic mt-2">{product.shortReason}</p>
            )}
          </div>

          <div>
            {isSelected ? (
              <button
                onClick={() => onRemove(product.id)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
                Quitar
              </button>
            ) : (
              <button
                onClick={() => onAdd(product)}
                className="inline-flex items-center gap-1.5 text-xs text-foreground border-b border-foreground/40 pb-0.5 hover:border-foreground transition-colors"
              >
                <Plus className="h-3 w-3" />
                Añadir a mi selección
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

import { Plus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";
import ProductImagePlaceholder from "./ProductImagePlaceholder";

interface ProductCardSuggestedProps {
  product: Product;
  isSelected: boolean;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
  stageBadge?: string;
}

export default function ProductCardSuggested({ product, isSelected, onAdd, onRemove, stageBadge }: ProductCardSuggestedProps) {
  return (
    <div className={`rounded-xl border ${isSelected ? "border-primary/30 bg-card shadow-sm" : "border-dashed border-border/60 bg-background"} overflow-hidden transition-all`}>
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
                <p className="text-[10px] text-muted-foreground mt-0.5">Mín. 3 meses</p>
              </div>
            </div>
            {stageBadge && !isSelected && (
              <span className="inline-block text-[11px] font-medium text-primary-foreground bg-primary/20 px-2 py-0.5 rounded-full mt-2">
                {stageBadge}
              </span>
            )}
            {product.shortReason && (
              <p className="text-xs text-muted-foreground mt-1.5">{product.shortReason}</p>
            )}
          </div>

          <div className="mt-3">
            {isSelected ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(product.id)}
              >
                <X className="h-3 w-3" />
                Quitar
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => onAdd(product)}
              >
                <Plus className="h-3 w-3" />
                Añadir a mi selección
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

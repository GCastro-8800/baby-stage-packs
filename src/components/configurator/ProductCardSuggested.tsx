import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/productCatalog";

interface ProductCardSuggestedProps {
  product: Product;
  isSelected: boolean;
  onAdd: (product: Product) => void;
  onRemove: (productId: string) => void;
}

export default function ProductCardSuggested({ product, isSelected, onAdd, onRemove }: ProductCardSuggestedProps) {
  return (
    <div className={`rounded-xl border ${isSelected ? "border-primary/30 bg-card" : "border-dashed border-border bg-background"} p-4 space-y-3`}>
      <div className="flex items-start gap-3">
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        )}
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

      <div className={isSelected ? "pl-9" : ""}>
        {isSelected ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs px-2 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(product.id)}
          >
            Quitar
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onAdd(product)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Añadir a mi selección
          </Button>
        )}
      </div>
    </div>
  );
}

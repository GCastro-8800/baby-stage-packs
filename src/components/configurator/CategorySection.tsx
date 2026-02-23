import { Baby, Moon, Heart, UtensilsCrossed, Package } from "lucide-react";
import { ProductCategory, Product, CATEGORY_LABELS } from "@/data/productCatalog";
import ProductCardSelected from "./ProductCardSelected";
import ProductCardSuggested from "./ProductCardSuggested";

const CATEGORY_ICONS: Record<ProductCategory, React.ElementType> = {
  movilidad: Baby,
  descanso: Moon,
  porteo: Heart,
  alimentacion: UtensilsCrossed,
  extras: Package,
};

interface CategorySectionProps {
  category: ProductCategory;
  selectedProduct?: Product;
  alternatives: Product[];
  suggestedProducts: Product[];
  isSelected: (id: string) => boolean;
  onSwap: (oldId: string, newProduct: Product) => void;
  onRemove: (productId: string) => void;
  onAdd: (product: Product) => void;
}

export default function CategorySection({
  category,
  selectedProduct,
  alternatives,
  suggestedProducts,
  isSelected,
  onSwap,
  onRemove,
  onAdd,
}: CategorySectionProps) {
  const Icon = CATEGORY_ICONS[category];
  const hasContent = selectedProduct || suggestedProducts.length > 0;

  if (!hasContent) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium text-sm">{CATEGORY_LABELS[category]}</h3>
      </div>

      {selectedProduct && (
        <ProductCardSelected
          product={selectedProduct}
          alternatives={alternatives}
          onSwap={onSwap}
          onRemove={onRemove}
        />
      )}

      {suggestedProducts.map((p) => (
        <ProductCardSuggested
          key={p.id}
          product={p}
          isSelected={isSelected(p.id)}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

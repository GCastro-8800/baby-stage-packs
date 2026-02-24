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
  stageBadge?: string;
  getDuration?: (productId: string) => number;
  setDuration?: (productId: string, months: number) => void;
  getDiscountedPrice?: (product: Product) => number;
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
  stageBadge,
  getDuration,
  setDuration,
  getDiscountedPrice,
}: CategorySectionProps) {
  const Icon = CATEGORY_ICONS[category];
  const hasContent = selectedProduct || suggestedProducts.length > 0;

  if (!hasContent) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 pb-1 border-b border-border/50">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="font-serif text-base font-medium">{CATEGORY_LABELS[category]}</h3>
      </div>

      {selectedProduct && (
        <ProductCardSelected
          product={selectedProduct}
          alternatives={alternatives}
          onSwap={onSwap}
          onRemove={onRemove}
          duration={getDuration ? getDuration(selectedProduct.id) : 6}
          onDurationChange={setDuration ?? (() => {})}
          discountedPrice={getDiscountedPrice ? getDiscountedPrice(selectedProduct) : selectedProduct.pricePerMonth}
        />
      )}

      {suggestedProducts.map((p) => (
        <ProductCardSuggested
          key={p.id}
          product={p}
          isSelected={isSelected(p.id)}
          onAdd={onAdd}
          onRemove={onRemove}
          stageBadge={stageBadge}
        />
      ))}
    </div>
  );
}

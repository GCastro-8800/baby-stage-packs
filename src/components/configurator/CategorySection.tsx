import { ProductCategory, Product, CATEGORY_LABELS } from "@/data/productCatalog";
import ProductCardSelected from "./ProductCardSelected";
import ProductCardSuggested from "./ProductCardSuggested";

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
  onPreview?: (product: Product) => void;
  selectedReasons?: string[];
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
  onPreview,
  selectedReasons,
}: CategorySectionProps) {
  const hasContent = selectedProduct || suggestedProducts.length > 0;

  if (!hasContent) return null;

  return (
    <div className="space-y-2">
      <div className="pb-2 border-b border-foreground/10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-foreground/50">Categoría</p>
        <h3 className="font-display text-xl mt-1">{CATEGORY_LABELS[category]}</h3>
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
          onPreview={onPreview}
          reasons={selectedReasons}
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
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}

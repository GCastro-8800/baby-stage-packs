import { Eye } from "lucide-react";
import type { EquipmentOption } from "@/data/planEquipment";

interface PackProductCardProps {
  product: EquipmentOption;
  onPreview: (product: EquipmentOption) => void;
}

const PackProductCard = ({ product, onPreview }: PackProductCardProps) => {
  return (
    <button
      onClick={() => onPreview(product)}
      className="group text-left rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-md hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {product.image && (
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img
            src={product.image}
            alt={`${product.brand} ${product.model}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 rounded-full p-2">
              <Eye className="h-4 w-4 text-foreground" />
            </span>
          </div>
        </div>
      )}
      <div className="p-3">
        <p className="font-serif font-semibold text-sm text-foreground">
          {product.brand} {product.model}
        </p>
        {product.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        )}
      </div>
    </button>
  );
};

export default PackProductCard;

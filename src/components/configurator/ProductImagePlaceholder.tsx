import { Baby, Moon, Heart, UtensilsCrossed, Package } from "lucide-react";
import { ProductCategory } from "@/data/productCatalog";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<ProductCategory, { icon: React.ElementType; gradient: string }> = {
  movilidad: { icon: Baby, gradient: "from-sky-100 to-blue-50" },
  descanso: { icon: Moon, gradient: "from-violet-100 to-purple-50" },
  porteo: { icon: Heart, gradient: "from-rose-100 to-pink-50" },
  alimentacion: { icon: UtensilsCrossed, gradient: "from-amber-100 to-orange-50" },
  extras: { icon: Package, gradient: "from-slate-100 to-gray-50" },
};

interface ProductImagePlaceholderProps {
  category: ProductCategory;
  image?: string;
  name?: string;
  size?: "sm" | "md" | "full";
  className?: string;
}

export default function ProductImagePlaceholder({ category, image, name, size = "md", className }: ProductImagePlaceholderProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  const sizeClasses = size === "full" ? "" : size === "sm" ? "w-16 h-16" : "w-20 h-20 md:w-24 md:h-24";
  const iconSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  if (image) {
    return (
      <div className={cn("rounded-xl overflow-hidden shrink-0", sizeClasses, className)}>
        <img src={image} alt={name || "Producto de equipamiento para bebé"} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br",
      config.gradient,
      sizeClasses,
      className
    )}>
      <Icon className={cn(iconSize, "text-muted-foreground/50")} />
    </div>
  );
}

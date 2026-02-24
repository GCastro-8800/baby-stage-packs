import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/data/productCatalog";
import ProductImagePlaceholder from "@/components/configurator/ProductImagePlaceholder";

interface CatalogProductCardProps {
  product: Product;
}

export default function CatalogProductCard({ product }: CatalogProductCardProps) {
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/mi-seleccion", { state: { preselectedProduct: product.id } });
  };

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="aspect-square bg-muted/30 flex items-center justify-center">
        <ProductImagePlaceholder
          category={product.category}
          image={product.image}
          size="md"
          className="w-full h-full rounded-none"
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{product.name}</p>
            <Badge variant="secondary" className="text-[10px] font-medium mt-1">
              {product.brand}
            </Badge>
          </div>
          <span className="shrink-0 bg-accent/10 text-foreground font-semibold text-sm px-2.5 py-1 rounded-lg">
            {product.pricePerMonth}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

        {product.shortReason && (
          <span className="inline-block w-fit text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {product.shortReason}
          </span>
        )}

        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full gap-1.5 text-xs"
          onClick={handleAdd}
        >
          <Plus className="h-3 w-3" />
          Añadir a mi selección
        </Button>
      </div>
    </Card>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/data/productCatalog";
import ProductImagePlaceholder from "@/components/configurator/ProductImagePlaceholder";
import ProductDetailDialog from "@/components/catalog/ProductDetailDialog";
import { toast } from "sonner";
import { DEFAULT_DURATION } from "@/lib/constants";

const STORAGE_KEY = "bebloo_selection";

function addToStoredSelection(product: Product): number {
  let stored: { productIds: string[]; durations: Record<string, number> };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    stored = raw ? JSON.parse(raw) : { productIds: [], durations: {} };
  } catch {
    stored = { productIds: [], durations: {} };
  }
  if (!stored.productIds.includes(product.id)) {
    stored.productIds.push(product.id);
    stored.durations[product.id] = DEFAULT_DURATION;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return stored.productIds.length;
}

function isInStoredSelection(productId: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const stored = JSON.parse(raw);
    return stored.productIds?.includes(productId) ?? false;
  } catch {
    return false;
  }
}

interface CatalogProductCardProps {
  product: Product;
}

export default function CatalogProductCard({ product }: CatalogProductCardProps) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(() => isInStoredSelection(product.id));
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAdd = () => {
    const count = addToStoredSelection(product);
    setAdded(true);
    toast.success(`${product.name} añadido`, {
      description: `Tienes ${count} producto${count > 1 ? "s" : ""} en tu selección`,
      action: {
        label: "Ver selección",
        onClick: () => navigate("/mi-seleccion"),
      },
    });
  };

  return (
    <>
      <Card
        className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setDialogOpen(true)}
      >
        <div className="aspect-square bg-muted/30 flex items-center justify-center">
          <ProductImagePlaceholder
            category={product.category}
            image={product.image}
            name={product.name}
            size="full"
            className="w-full h-full rounded-none"
          />
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{product.name}</p>
              <Badge variant="secondary" className="text-[10px] font-medium mt-1">
                {product.brand}
              </Badge>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block bg-accent/10 text-foreground font-semibold text-sm px-2.5 py-1 rounded-lg">
                {product.prices?.[3] ?? product.pricePerMonth}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
              </span>
              <p className="text-[10px] text-muted-foreground mt-0.5">Desde 3 meses</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>

          {product.shortReason && (
            <span className="inline-block w-fit text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {product.shortReason}
            </span>
          )}

          {added ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-2 w-full gap-1.5 text-xs"
              onClick={(e) => { e.stopPropagation(); navigate("/mi-seleccion"); }}
            >
              <Check className="h-3 w-3" />
              En tu selección — ver
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-full gap-1.5 text-xs"
              onClick={(e) => { e.stopPropagation(); handleAdd(); }}
            >
              <Plus className="h-3 w-3" />
              Añadir a mi selección
            </Button>
          )}
        </div>
      </Card>

      <ProductDetailDialog
        product={product}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        added={added}
        onAdd={handleAdd}
      />
    </>
  );
}

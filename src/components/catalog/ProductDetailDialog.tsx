import { useNavigate } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductImagePlaceholder from "@/components/configurator/ProductImagePlaceholder";
import type { Product } from "@/data/productCatalog";

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  added: boolean;
  onAdd: () => void;
}

export default function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  added,
  onAdd,
}: ProductDetailDialogProps) {
  const navigate = useNavigate();

  if (!product) return null;

  const lowestPrice = product.prices?.[3] ?? product.pricePerMonth;
  const specs = product.specs ?? {};
  const specEntries = Object.entries(specs);

    return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-y-auto p-0 sm:max-w-xl max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 pr-14">
          <DialogTitle className="font-serif text-lg sm:text-xl">
            {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalles de {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mx-6 overflow-hidden rounded-2xl border bg-muted/20">
          <div className="aspect-[16/10] sm:aspect-[4/3]">
            <ProductImagePlaceholder
              category={product.category}
              image={product.image}
              name={product.name}
              size="full"
              className="h-full w-full rounded-none"
            />
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <div className="space-y-4 rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary" className="text-xs font-medium">
                {product.brand}
              </Badge>
              <span className="inline-block rounded-lg bg-accent/10 px-2.5 py-1 text-sm font-semibold text-foreground">
                {lowestPrice}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
              </span>
            </div>

            {product.shortReason && (
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {product.shortReason}
              </span>
            )}

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {specEntries.length > 0 && (
              <div className="overflow-hidden rounded-xl border">
                {specEntries.map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex items-start justify-between gap-4 px-3 py-2.5 text-sm ${
                      i % 2 === 0 ? "bg-muted/30" : "bg-background"
                    }`}
                  >
                    <span className="font-medium text-muted-foreground">{key}</span>
                    <span className="text-right text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {added ? (
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full gap-1.5"
              onClick={() => {
                onOpenChange(false);
                navigate("/mi-seleccion");
              }}
            >
              <Check className="h-3.5 w-3.5" />
              En tu selección — ver
            </Button>
          ) : (
            <Button
              size="sm"
              className="mt-4 w-full gap-1.5"
              onClick={() => {
                onAdd();
                onOpenChange(false);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
              Añadir a mi selección
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

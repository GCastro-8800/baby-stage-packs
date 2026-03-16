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
      <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="font-serif text-lg">
            {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalles de {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="mx-4 rounded-xl overflow-hidden bg-muted/20 aspect-[4/3]">
          <ProductImagePlaceholder
            category={product.category}
            image={product.image}
            name={product.name}
            size="full"
            className="w-full h-full rounded-none object-contain"
          />
        </div>

        <div className="space-y-3 px-6 pb-6 pt-3">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {product.brand}
            </Badge>
            <span className="inline-block bg-accent/10 text-foreground font-semibold text-sm px-2.5 py-1 rounded-lg">
              {lowestPrice}€<span className="text-xs font-normal text-muted-foreground">/mes</span>
            </span>
          </div>

          {product.shortReason && (
            <span className="inline-block text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {product.shortReason}
            </span>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {specEntries.length > 0 && (
            <div className="rounded-lg border overflow-hidden">
              {specEntries.map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex justify-between px-3 py-2 text-sm ${
                    i % 2 === 0 ? "bg-muted/30" : ""
                  }`}
                >
                  <span className="text-muted-foreground font-medium">{key}</span>
                  <span className="text-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          )}

          {added ? (
            <Button
              variant="secondary"
              size="sm"
              className="w-full gap-1.5"
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
              className="w-full gap-1.5"
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

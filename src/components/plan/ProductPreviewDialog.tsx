import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { EquipmentOption } from "@/data/planEquipment";

interface ProductPreviewDialogProps {
  product: EquipmentOption | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductPreviewDialog = ({ product, open, onOpenChange }: ProductPreviewDialogProps) => {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  if (!product) return null;

  const handleCTA = () => {
    track("cta_click", { location: "packs_product_dialog", action: "scroll_to_pricing", product: `${product.brand} ${product.model}` });
    onOpenChange(false);
    navigate("/#precios");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            {product.brand} {product.model}
          </DialogTitle>
          {product.description && (
            <DialogDescription className="text-sm leading-relaxed">
              {product.description}
            </DialogDescription>
          )}
        </DialogHeader>
        {product.image && (
          <div className="rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={`${product.brand} ${product.model}`}
              className="w-full aspect-square object-cover"
              loading="lazy"
            />
          </div>
        )}
        <Button variant="outline" size="sm" className="gap-2 w-full" onClick={handleCTA}>
          Incluido en nuestros planes
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { EquipmentOption } from "@/data/planEquipment";

interface ProductPreviewDialogProps {
  product: EquipmentOption | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductPreviewDialog = ({ product, open, onOpenChange }: ProductPreviewDialogProps) => {
  if (!product) return null;

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
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;

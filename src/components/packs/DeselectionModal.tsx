import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface DeselectionModalProps {
  open: boolean;
  productName: string;
  packPrice: number;
  priceWithout: number;
  onKeep: () => void;
  onRemove: () => void;
}

const DeselectionModal = ({
  open,
  productName,
  packPrice,
  priceWithout,
  onKeep,
  onRemove,
}: DeselectionModalProps) => {
  const diff = priceWithout - packPrice;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onKeep(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">¿Seguro que quieres quitar este producto?</DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground mt-1">
            {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 my-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Precio pack completo:</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <CheckCircle className="h-4 w-4" />
              €{packPrice}/mes
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sin este producto:</span>
            <span className="flex items-center gap-1 font-semibold text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              €{priceWithout.toFixed(0)}/mes
            </span>
          </div>
          <div className="border-t pt-2 flex items-center justify-between">
            <span className="text-sm font-medium text-destructive">Te costará más:</span>
            <span className="font-bold text-destructive">+€{diff.toFixed(0)}/mes</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Al quitar productos del pack, pagas precio individual por cada producto que mantengas. El pack completo es siempre la mejor oferta.
        </p>

        <div className="flex gap-3 mt-2">
          <Button onClick={onKeep} className="flex-1" variant="default">
            Mantener producto
          </Button>
          <Button onClick={onRemove} className="flex-1" variant="outline">
            Quitar de todas formas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeselectionModal;

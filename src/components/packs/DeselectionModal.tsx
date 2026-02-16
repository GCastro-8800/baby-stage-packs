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
  precioEnPack: number;
  precioIndividual: number;
  packPrice: number;
  priceWithout: number;
  onKeep: () => void;
  onRemove: () => void;
}

const DeselectionModal = ({
  open,
  productName,
  precioEnPack,
  precioIndividual,
  packPrice,
  priceWithout,
  onKeep,
  onRemove,
}: DeselectionModalProps) => {
  const productDiff = precioIndividual - precioEnPack;
  const totalDiff = priceWithout - packPrice;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onKeep(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">¿Quieres quitar este producto?</DialogTitle>
          <DialogDescription className="text-base font-medium text-foreground mt-1">
            {productName}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border bg-muted/30 p-4 space-y-3 my-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">En pack completo:</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <CheckCircle className="h-4 w-4" />
              €{precioEnPack.toFixed(2)}/mes
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sin pack:</span>
            <span className="flex items-center gap-1 font-semibold text-orange-500">
              <AlertTriangle className="h-4 w-4" />
              €{precioIndividual.toFixed(2)}/mes
            </span>
          </div>
          {productDiff > 0 && (
            <div className="border-t pt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-destructive">Pagarías más por este producto:</span>
              <span className="font-bold text-destructive">+€{productDiff.toFixed(2)}/mes</span>
            </div>
          )}
        </div>

        {totalDiff > 0 && (
          <div className="rounded-lg border bg-orange-50 dark:bg-orange-900/10 p-3">
            <p className="text-xs text-orange-700 dark:text-orange-400">
              Tu total pasaría de <strong>€{packPrice}/mes</strong> (pack completo) a <strong>€{priceWithout.toFixed(0)}/mes</strong> (productos sueltos).
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Al quitar productos del pack, pagas precio individual por cada producto que mantengas. El pack completo es siempre la mejor oferta.
        </p>

        <div className="flex gap-3 mt-2">
          <Button onClick={onKeep} className="flex-1" variant="default">
            Mantener pack completo
          </Button>
          <Button onClick={onRemove} className="flex-1" variant="outline">
            Quitar producto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeselectionModal;

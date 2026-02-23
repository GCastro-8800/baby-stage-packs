import { Button } from "@/components/ui/button";

interface StickyMobileBarProps {
  count: number;
  totalPrice: number;
  onCheckout: () => void;
}

export default function StickyMobileBar({ count, totalPrice, onCheckout }: StickyMobileBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card p-3 flex items-center justify-between gap-3 md:hidden">
      <div>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "producto" : "productos"}
        </p>
        <p className="text-lg font-serif font-semibold">{totalPrice}€<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
      </div>
      <Button className="cta-tension" onClick={onCheckout}>
        Contratar
      </Button>
    </div>
  );
}

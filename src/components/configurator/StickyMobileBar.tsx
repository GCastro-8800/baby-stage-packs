import { Button } from "@/components/ui/button";

interface StickyMobileBarProps {
  count: number;
  totalPrice: number;
  onCheckout: () => void;
}

export default function StickyMobileBar({ count, totalPrice, onCheckout }: StickyMobileBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)] p-4 flex items-center justify-between gap-4 md:hidden">
      <div>
        <p className="text-xs text-muted-foreground">
          {count} {count === 1 ? "producto" : "productos"}
        </p>
        <p className="text-xl font-serif font-semibold">
          {totalPrice}€<span className="text-sm font-normal text-muted-foreground">/mes</span>
        </p>
      </div>
      <Button className="cta-tension flex-1 max-w-[200px]" size="lg" onClick={onCheckout}>
        Contratar
      </Button>
    </div>
  );
}

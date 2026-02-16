import { Lightbulb } from "lucide-react";

interface LowProductWarningProps {
  selectedCount: number;
  totalCount: number;
  currentPrice: number;
  packPrice: number;
}

const LowProductWarning = ({
  selectedCount,
  totalCount,
  currentPrice,
  packPrice,
}: LowProductWarningProps) => {
  if (selectedCount > 2 || selectedCount === totalCount) return null;

  const costPerProduct = currentPrice / selectedCount;
  const packCostPerProduct = packPrice / totalCount;

  return (
    <div className="rounded-xl border-2 border-yellow-400/50 bg-yellow-50 dark:bg-yellow-900/10 p-4 mb-6">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            Consejo: Añadir más productos reduce el coste por producto
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
            Con el pack completo pagarías €{packPrice}/mes por {totalCount} productos (€{packCostPerProduct.toFixed(0)}/producto).
            Ahora pagas €{currentPrice.toFixed(0)}/mes por {selectedCount} producto{selectedCount !== 1 ? "s" : ""} (€{costPerProduct.toFixed(0)}/producto).
          </p>
        </div>
      </div>
    </div>
  );
};

export default LowProductWarning;

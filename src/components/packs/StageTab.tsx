import { useState } from "react";
import type { StageData } from "@/data/packsByStage";
import type { EquipmentOption } from "@/data/planEquipment";
import PackProductCard from "./PackProductCard";
import ProductPreviewDialog from "@/components/plan/ProductPreviewDialog";

interface StageTabProps {
  stage: StageData;
}

const StageTab = ({ stage }: StageTabProps) => {
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  return (
    <div className="space-y-10">
      {/* Stage header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {stage.ageRange}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-1">
          {stage.name}
        </h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          {stage.description}
        </p>
      </div>

      {/* Equipment categories */}
      {stage.equipment.map((cat) => (
        <section key={cat.category} className="space-y-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {cat.category}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">{cat.why}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {cat.options.map((product) => (
              <PackProductCard
                key={`${product.brand}-${product.model}`}
                product={product}
                onPreview={setPreviewProduct}
              />
            ))}
          </div>
        </section>
      ))}

      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
    </div>
  );
};

export default StageTab;

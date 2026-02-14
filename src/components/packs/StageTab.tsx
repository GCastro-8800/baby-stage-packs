import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { StageData } from "@/data/packsByStage";
import type { EquipmentOption } from "@/data/planEquipment";
import { Button } from "@/components/ui/button";
import PackProductCard from "./PackProductCard";
import ProductPreviewDialog from "@/components/plan/ProductPreviewDialog";
import { useAnalytics } from "@/hooks/useAnalytics";

interface StageTabProps {
  stage: StageData;
}

const StageTab = ({ stage }: StageTabProps) => {
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const handleStageCTA = () => {
    track("cta_click", { location: `packs_stage_${stage.id}`, action: "scroll_to_pricing" });
    navigate("/#precios");
  };

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

      {/* Contextual CTA */}
      <div className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground text-sm mb-3">{stage.cta}</p>
        <Button variant="outline" className="gap-2" onClick={handleStageCTA}>
          Ver planes desde 59&nbsp;€/mes
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
    </div>
  );
};

export default StageTab;

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import ProductPreviewDialog from "@/components/packs/ProductPreviewDialog";
import { getPackConfig } from "@/data/packStages";
import type { PackStage } from "@/data/packStages";
import type { EquipmentOption, EquipmentCategory } from "@/data/planEquipment";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePackSelections } from "@/hooks/usePackSelections";
import { toast } from "sonner";

const PackDetail = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const pack = packId ? getPackConfig(packId) : undefined;

  const {
    initStageIfNeeded,
    getStageSelections,
    updateStageSelections,
    calculateTotalPrice,
    getGlobalCounts,
    getSelectedItemsMap,
  } = usePackSelections(packId || "");

  const [activeTab, setActiveTab] = useState<string>("");
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  // Initialize all stages on mount
  useEffect(() => {
    if (!pack) return;
    pack.stages.forEach((stage) => {
      const fixedKeys = stage.products.filter((c) => c.type === "fixed").map((c) => c.category);
      const choiceKeys = stage.products.filter((c) => c.type === "choice").map((c) => c.category);
      initStageIfNeeded(stage.id, fixedKeys, choiceKeys, stage.products);
    });
    if (pack.stages.length > 0 && !activeTab) {
      setActiveTab(pack.stages[0].id);
    }
  }, [pack, initStageIfNeeded, activeTab]);

  const currentPrice = pack ? calculateTotalPrice(pack) : 0;
  const globalCounts = pack ? getGlobalCounts(pack) : { selectedCount: 0, totalCount: 0 };

  const handleToggle = useCallback(
    (stageId: string, category: string, type: "fixed" | "choice") => {
      const sel = getStageSelections(stageId);
      const isSelected = sel
        ? type === "fixed"
          ? sel.selectedFixed.has(category)
          : sel.selectedChoice.has(category)
        : true;

      if (isSelected) {
        if (globalCounts.selectedCount <= 1) {
          toast.error("Debes tener al menos un producto seleccionado");
          return;
        }
        updateStageSelections(stageId, (prev) => {
          if (type === "fixed") {
            const next = new Set(prev.selectedFixed);
            next.delete(category);
            return { ...prev, selectedFixed: next };
          } else {
            const next = new Set(prev.selectedChoice);
            next.delete(category);
            return { ...prev, selectedChoice: next };
          }
        });
      } else {
        updateStageSelections(stageId, (prev) => {
          if (type === "fixed") {
            const next = new Set(prev.selectedFixed);
            next.add(category);
            return { ...prev, selectedFixed: next };
          } else {
            const next = new Set(prev.selectedChoice);
            next.add(category);
            return { ...prev, selectedChoice: next };
          }
        });
      }
    },
    [getStageSelections, updateStageSelections, globalCounts.selectedCount]
  );

  const handleVariantChange = useCallback(
    (stageId: string, category: string, idx: number) => {
      updateStageSelections(stageId, (prev) => ({
        ...prev,
        variantChoices: { ...prev.variantChoices, [category]: idx },
      }));
    },
    [updateStageSelections]
  );

  const handleContinue = () => {
    if (!pack) return;
    track("checkout_start", {
      pack: pack.id,
      price: currentPrice,
      selected_count: globalCounts.selectedCount,
    });
    const selections = getSelectedItemsMap(pack);
    navigate(`/packs/${pack.id}/checkout`, { state: { selections } });
  };

  if (!pack) return <Navigate to="/#precios" replace />;

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <section className="pt-28 pb-8 md:pt-36 px-4">
        <div className="container max-w-3xl">
          <PackBreadcrumbs packName={pack.name} packId={pack.id} />

          <div className="text-center space-y-2 mb-10">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              {pack.name}
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              {pack.tagline}
            </p>
          </div>

          {/* Stage tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex mb-8">
              {pack.stages.map((stage) => (
                <TabsTrigger key={stage.id} value={stage.id} className="flex-1 text-xs sm:text-sm">
                  {stage.name.replace(/^Etapa \d+ — /, "")}
                </TabsTrigger>
              ))}
            </TabsList>

            {pack.stages.map((stage) => (
              <TabsContent key={stage.id} value={stage.id}>
                <StagePanel
                  stage={stage}
                  getStageSelections={getStageSelections}
                  onToggle={handleToggle}
                  onVariantChange={handleVariantChange}
                  onPreview={setPreviewProduct}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="container max-w-3xl px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-foreground">
              €{Math.round(currentPrice)}/mes
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              {globalCounts.selectedCount} de {globalCounts.totalCount} productos
            </p>
          </div>
          <Button onClick={handleContinue} className="gap-2">
            Continuar al pago
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => !open && setPreviewProduct(null)}
      />
      <Footer />
    </div>
  );
};

/* ── Stage panel (rendered inside each tab) ── */

interface StagePanelProps {
  stage: PackStage;
  getStageSelections: (stageId: string) => any;
  onToggle: (stageId: string, category: string, type: "fixed" | "choice") => void;
  onVariantChange: (stageId: string, category: string, idx: number) => void;
  onPreview: (product: EquipmentOption) => void;
}

const StagePanel = ({ stage, getStageSelections, onToggle, onVariantChange, onPreview }: StagePanelProps) => {
  const sel = getStageSelections(stage.id);
  const selectedFixed = sel?.selectedFixed || new Set<string>();
  const selectedChoice = sel?.selectedChoice || new Set<string>();
  const variantChoices = sel?.variantChoices || {};

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-xs text-primary/70 font-medium">{stage.subtitle}</p>
        <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
      </div>

      {stage.products.map((cat) => {
        const isFixed = cat.type === "fixed";
        const isSelected = isFixed ? selectedFixed.has(cat.category) : selectedChoice.has(cat.category);
        const currentIdx = !isFixed ? (variantChoices[cat.category] || 0) : 0;
        const currentOpt = cat.options[currentIdx];

        return (
          <div key={cat.category} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">{cat.category}</h3>
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={(e) => {
                  e.preventDefault();
                  onToggle(stage.id, cat.category, cat.type);
                }}
              >
                <span className="text-xs text-muted-foreground">
                  {isSelected ? "Incluido" : "No incluido"}
                </span>
                <Checkbox checked={isSelected} onCheckedChange={() => {}} />
              </label>
            </div>

            <div className={`transition-opacity ${!isSelected ? "opacity-40 pointer-events-none" : ""}`}>
              {isFixed ? (
                /* Fixed product — single card */
                <FixedProductRow product={cat.options[0]} onPreview={onPreview} />
              ) : (
                /* Choice product — radio group */
                <RadioGroup
                  value={String(currentIdx)}
                  onValueChange={(val) => onVariantChange(stage.id, cat.category, Number(val))}
                  className="space-y-2"
                >
                  {cat.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                        currentIdx === idx
                          ? "border-primary/40 bg-primary/5"
                          : "border-border hover:border-primary/20"
                      }`}
                    >
                      <RadioGroupItem value={String(idx)} className="shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {opt.brand} {opt.model}
                        </p>
                        {opt.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{opt.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-primary">
                          €{(opt.precio_en_pack || 0).toFixed(0)}/mes
                        </span>
                        <button
                          type="button"
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onPreview(opt);
                          }}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const FixedProductRow = ({ product, onPreview }: { product: EquipmentOption; onPreview: (p: EquipmentOption) => void }) => {
  if (!product) return null;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {product.brand} {product.model}
        </p>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-medium text-primary">
          €{(product.precio_en_pack || 0).toFixed(0)}/mes
        </span>
        <button
          type="button"
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => onPreview(product)}
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PackDetail;

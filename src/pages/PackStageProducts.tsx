import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import DeselectionModal from "@/components/packs/DeselectionModal";
import StickyPriceFooter from "@/components/packs/StickyPriceFooter";
import LowProductWarning from "@/components/packs/LowProductWarning";
import ProductPreviewDialog from "@/components/packs/ProductPreviewDialog";
import { getPackConfig, getPackStage } from "@/data/packStages";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePackSelections } from "@/hooks/usePackSelections";
import type { EquipmentOption, EquipmentCategory } from "@/data/planEquipment";
import { toast } from "sonner";

const PackStageProducts = () => {
  const { packId, stageId } = useParams<{ packId: string; stageId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const pack = packId ? getPackConfig(packId) : undefined;
  const stage = packId && stageId ? getPackStage(packId, stageId) : undefined;

  const {
    initStageIfNeeded,
    getStageSelections,
    updateStageSelections,
    isPackComplete: checkPackComplete,
    calculateTotalPrice,
    calculatePackCompletePrice,
    getGlobalCounts,
    getGlobalProductBreakdown,
    getSelectedItemsMap,
  } = usePackSelections(packId || "");

  const { fixedCategories, choiceCategories, fixedKeys, choiceKeys, totalCategoryCount } = useMemo(() => {
    if (!stage) return { fixedCategories: [] as EquipmentCategory[], choiceCategories: [] as EquipmentCategory[], fixedKeys: [] as string[], choiceKeys: [] as string[], totalCategoryCount: 0 };
    const fixed = stage.products.filter((c) => c.type === "fixed");
    const choice = stage.products.filter((c) => c.type === "choice");
    const fKeys = fixed.map((c) => c.category);
    const cKeys = choice.map((c) => c.category);
    return { fixedCategories: fixed, choiceCategories: choice, fixedKeys: fKeys, choiceKeys: cKeys, totalCategoryCount: stage.products.length };
  }, [stage]);

  // Initialize stage selections on first visit (all selected by default)
  useEffect(() => {
    if (stageId && stage) {
      initStageIfNeeded(stageId, fixedKeys, choiceKeys, stage.products);
    }
  }, [stageId, stage, fixedKeys, choiceKeys, initStageIfNeeded]);

  // Read selections from global store
  const stageSelections = stageId ? getStageSelections(stageId) : undefined;
  const selectedFixed = stageSelections?.selectedFixed || new Set(fixedKeys);
  const selectedChoice = stageSelections?.selectedChoice || new Set(choiceKeys);
  const variantChoices = stageSelections?.variantChoices || {};

  const [pendingDeselect, setPendingDeselect] = useState<{ category: string; product: EquipmentOption; type: "fixed" | "choice" } | null>(null);
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  // Global pack complete check
  const isPackComplete = pack ? checkPackComplete(pack) : false;

  // Global price
  const currentPrice = pack ? calculateTotalPrice(pack) : 0;

  // Dynamic pack complete price (all products selected with current variants + serviceFee)
  const packCompletePrice = pack ? calculatePackCompletePrice(pack) : 0;

  // Global counts
  const globalCounts = pack ? getGlobalCounts(pack) : { selectedCount: 0, totalCount: 0 };

  const calculateIndividualTotalWithout = useCallback((withoutCategory: string) => {
    // Calculate what the global price would be if we removed this category
    if (!pack) return 0;
    let total = 0;
    pack.stages.forEach((s) => {
      const sel = s.id === stageId ? { selectedFixed, selectedChoice, variantChoices } : getStageSelections(s.id);
      s.products.forEach((cat) => {
        if (s.id === stageId && cat.category === withoutCategory) return;
        const isFixed = cat.type === "fixed";
        const isSelected = sel
          ? isFixed
            ? sel.selectedFixed.has(cat.category)
            : sel.selectedChoice.has(cat.category)
          : true;
        if (!isSelected) return;
        const idx = !isFixed && sel ? (sel.variantChoices[cat.category] || 0) : 0;
        total += cat.options[idx]?.precio_individual || 0;
      });
    });
    return total;
  }, [pack, stageId, selectedFixed, selectedChoice, variantChoices, getStageSelections]);

  const priceWithoutPending = useMemo(() => {
    if (!pendingDeselect) return 0;
    return calculateIndividualTotalWithout(pendingDeselect.category);
  }, [pendingDeselect, calculateIndividualTotalWithout]);

  // Global product breakdown for footer
  const productBreakdown = pack ? getGlobalProductBreakdown(pack) : [];

  if (!pack || !stage) return <Navigate to={packId ? `/packs/${packId}` : "/#precios"} replace />;

  const handleToggle = (category: string, product: EquipmentOption, type: "fixed" | "choice") => {
    const isSelected = type === "fixed" ? selectedFixed.has(category) : selectedChoice.has(category);
    if (isSelected) {
      if (globalCounts.selectedCount <= 1) {
        toast.error("Debes tener al menos un producto seleccionado");
        return;
      }
      track("product_deselect_attempt", { pack: pack.id, product: `${product.brand} ${product.model}` });
      setPendingDeselect({ category, product, type });
    } else {
      if (!stageId) return;
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
  };

  const handleConfirmDeselect = () => {
    if (!pendingDeselect || !stageId) return;
    track("product_deselect_confirmed", { pack: pack.id, product: `${pendingDeselect.product.brand} ${pendingDeselect.product.model}` });
    updateStageSelections(stageId, (prev) => {
      if (pendingDeselect.type === "fixed") {
        const next = new Set(prev.selectedFixed);
        next.delete(pendingDeselect.category);
        return { ...prev, selectedFixed: next };
      } else {
        const next = new Set(prev.selectedChoice);
        next.delete(pendingDeselect.category);
        return { ...prev, selectedChoice: next };
      }
    });
    setPendingDeselect(null);
  };

  const handleCancelDeselect = () => {
    if (pendingDeselect) {
      track("product_deselect_cancelled", { pack: pack.id, product: `${pendingDeselect.product.brand} ${pendingDeselect.product.model}` });
    }
    setPendingDeselect(null);
  };

  const handleVariantChange = (category: string, idx: number) => {
    if (!stageId) return;
    updateStageSelections(stageId, (prev) => ({
      ...prev,
      variantChoices: { ...prev.variantChoices, [category]: idx },
    }));
  };

  const currentStageIdx = pack.stages.findIndex((s) => s.id === stageId);
  const nextStage = pack.stages[currentStageIdx + 1];

  const handleContinue = () => {
    track("checkout_start", {
      pack: pack.id,
      stage: stageId,
      is_pack_complete: isPackComplete,
      price: currentPrice,
      selected_count: globalCounts.selectedCount,
    });
    if (nextStage) {
      navigate(`/packs/${pack.id}/etapa/${nextStage.id}`);
    } else {
      const selections = getSelectedItemsMap(pack);
      navigate(`/packs/${pack.id}/checkout`, { state: { selections } });
    }
  };

  const renderPriceInfo = (opt: EquipmentOption, isSelected: boolean) => {
    const precioEnPack = opt.precio_en_pack || 0;
    const precioIndividual = opt.precio_individual || 0;
    const ahorro = precioIndividual - precioEnPack;

    if (isPackComplete && isSelected) {
      return (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-primary flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> En pack: €{precioEnPack.toFixed(2)}/mes
          </p>
          <p className="text-xs text-muted-foreground">Sin pack: €{precioIndividual.toFixed(2)}/mes</p>
          <p className="text-xs font-medium text-primary">Ahorro: €{ahorro.toFixed(2)}/mes</p>
        </div>
      );
    }

    if (!isPackComplete && isSelected) {
      return (
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-orange-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Precio: €{precioIndividual.toFixed(2)}/mes
          </p>
          <p className="text-xs text-muted-foreground">Con pack: €{precioEnPack.toFixed(2)}/mes</p>
          <p className="text-xs font-medium text-orange-600">Pagas €{ahorro.toFixed(2)} más sin pack</p>
        </div>
      );
    }

    return (
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground">Si lo añades: €{precioIndividual.toFixed(2)}/mes</p>
        <p className="text-xs text-muted-foreground">Con pack completo: €{precioEnPack.toFixed(2)}/mes</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-40">
      <Header />

      <section className="pt-28 pb-8 md:pt-36 px-4">
        <div className="container max-w-3xl">
          <PackBreadcrumbs packName={pack.name} packId={pack.id} stageName={stage.name} />

          <div className="text-center space-y-2 mb-10">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              {stage.name}
            </h1>
            <p className="text-xs text-primary/70 font-medium">{stage.subtitle}</p>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">{stage.description}</p>
            {isPackComplete && (
              <p className="text-xs text-primary font-medium flex items-center justify-center gap-1 mt-2">
                <CheckCircle className="h-3.5 w-3.5" />
                Tu pack incluye todo lo que necesitas. El pack completo es nuestra mejor oferta.
              </p>
            )}
          </div>

          <LowProductWarning
            selectedCount={globalCounts.selectedCount}
            totalCount={globalCounts.totalCount}
            currentPrice={currentPrice}
            packPrice={packCompletePrice}
          />

          {/* Fixed products */}
          {fixedCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Productos incluidos en tu pack
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fixedCategories.map((cat) => {
                  const opt = cat.options[0];
                  if (!opt) return null;
                  const isSelected = selectedFixed.has(cat.category);
                  return (
                    <div
                      key={cat.category}
                      className={`rounded-xl border-2 bg-card p-5 transition-all ${
                        isSelected ? "border-primary/40 shadow-sm" : "border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{cat.category}</h4>
                          <p className="text-sm mt-0.5">
                            <span className="font-medium text-foreground">{opt.brand}</span>{" "}
                            <span className="text-muted-foreground">{opt.model}</span>
                          </p>
                        </div>
                        {(opt.image || opt.description) && (
                          <button
                            type="button"
                            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label={`Ver ${opt.brand} ${opt.model}`}
                            onClick={() => setPreviewProduct(opt)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="mb-3">
                        {renderPriceInfo(opt, isSelected)}
                      </div>

                      <label
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggle(cat.category, opt, "fixed");
                        }}
                      >
                        <Checkbox checked={isSelected} onCheckedChange={() => {}} />
                        <span className="text-xs text-muted-foreground">Incluir en mi suscripción</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Choice products */}
          {choiceCategories.map((cat) => {
            const isCatSelected = selectedChoice.has(cat.category);
            const currentIdx = variantChoices[cat.category] || 0;
            const currentOpt = cat.options[currentIdx];
            return (
            <div key={cat.category} className="mb-8">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Elige tu {cat.category.toLowerCase()}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Selecciona la opción que mejor se adapte a ti</p>

              <div className={`transition-opacity ${!isCatSelected ? "opacity-50 pointer-events-none" : ""}`}>
                <RadioGroup
                  value={String(currentIdx)}
                  onValueChange={(val) => handleVariantChange(cat.category, Number(val))}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {cat.options.map((opt, idx) => {
                    const isChosen = currentIdx === idx;
                    return (
                      <label
                        key={idx}
                        className={`rounded-xl border-2 bg-card p-5 cursor-pointer transition-all ${
                          isChosen ? "border-primary/40 shadow-sm" : "border-border hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm">
                              <span className="font-medium text-foreground">{opt.brand}</span>{" "}
                              <span className="text-muted-foreground">{opt.model}</span>
                            </p>
                            {opt.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{opt.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {(opt.image || opt.description) && (
                              <button
                                type="button"
                                className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label={`Ver ${opt.brand} ${opt.model}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPreviewProduct(opt);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                            <RadioGroupItem value={String(idx)} />
                          </div>
                        </div>

                        <div>
                          {renderPriceInfo(opt, isChosen && isCatSelected)}
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>

              <label
                className="flex items-center gap-2 cursor-pointer select-none mt-3"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentOpt) handleToggle(cat.category, currentOpt, "choice");
                }}
              >
                <Checkbox checked={isCatSelected} onCheckedChange={() => {}} />
                <span className="text-xs text-muted-foreground">Incluir en mi suscripción</span>
              </label>
            </div>
            );
          })}
          

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3 mt-8">
            {nextStage && (
              <Button
                size="lg"
                variant="ghost"
                className="gap-2"
                onClick={() => {
                  track("pack_stage_next", { pack: pack.id, from: stageId, to: nextStage.id });
                  navigate(`/packs/${pack.id}/etapa/${nextStage.id}`);
                }}
              >
                Siguiente: {nextStage.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/packs/${pack.id}`)}
            >
              ← Volver a etapas
            </Button>
          </div>
        </div>
      </section>

      {pendingDeselect && (
        <DeselectionModal
          open={!!pendingDeselect}
          productName={`${pendingDeselect.product.brand} ${pendingDeselect.product.model}`}
          precioEnPack={pendingDeselect.product.precio_en_pack || 0}
          precioIndividual={pendingDeselect.product.precio_individual || 0}
          packPrice={packCompletePrice}
          priceWithout={priceWithoutPending}
          onKeep={handleCancelDeselect}
          onRemove={handleConfirmDeselect}
        />
      )}

      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => { if (!open) setPreviewProduct(null); }}
      />

      <StickyPriceFooter
        currentPrice={currentPrice}
        packPrice={packCompletePrice}
        isPackComplete={isPackComplete}
        selectedCount={globalCounts.selectedCount}
        totalCount={globalCounts.totalCount}
        products={productBreakdown}
        serviceFee={pack.serviceFee}
        onContinue={handleContinue}
      />

      <Footer />
    </div>
  );
};

export default PackStageProducts;

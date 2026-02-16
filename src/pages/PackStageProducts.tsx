import { useState, useMemo, useCallback } from "react";
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
import ProductPreviewDialog from "@/components/plan/ProductPreviewDialog";
import { getPackConfig, getPackStage } from "@/data/packStages";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { EquipmentOption, EquipmentCategory } from "@/data/planEquipment";
import { toast } from "sonner";

const PackStageProducts = () => {
  const { packId, stageId } = useParams<{ packId: string; stageId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const pack = packId ? getPackConfig(packId) : undefined;
  const stage = packId && stageId ? getPackStage(packId, stageId) : undefined;

  const { fixedCategories, choiceCategories, fixedKeys, totalCategoryCount } = useMemo(() => {
    if (!stage) return { fixedCategories: [] as EquipmentCategory[], choiceCategories: [] as EquipmentCategory[], fixedKeys: [] as string[], totalCategoryCount: 0 };
    const fixed = stage.products.filter((c) => c.type === "fixed");
    const choice = stage.products.filter((c) => c.type === "choice");
    const keys = fixed.map((c) => c.category);
    return { fixedCategories: fixed, choiceCategories: choice, fixedKeys: keys, totalCategoryCount: stage.products.length };
  }, [stage]);

  const [selectedFixed, setSelectedFixed] = useState<Set<string>>(() => new Set(fixedKeys));
  const [variantChoices, setVariantChoices] = useState<Record<string, number>>(() => {
    if (!stage) return {};
    const choices: Record<string, number> = {};
    stage.products.filter((c) => c.type === "choice").forEach((c) => { choices[c.category] = 0; });
    return choices;
  });

  const [pendingDeselect, setPendingDeselect] = useState<{ category: string; product: EquipmentOption } | null>(null);
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  if (!pack || !stage) return <Navigate to={packId ? `/packs/${packId}` : "/#precios"} replace />;

  const isPackComplete = fixedKeys.every((k) => selectedFixed.has(k));

  const calculateIndividualTotal = useCallback((withoutCategory?: string) => {
    let total = 0;
    fixedCategories.forEach((cat) => {
      if (withoutCategory === cat.category) return;
      if (selectedFixed.has(cat.category)) {
        total += cat.options[0]?.precio_individual || 0;
      }
    });
    choiceCategories.forEach((cat) => {
      const idx = variantChoices[cat.category] || 0;
      total += cat.options[idx]?.precio_individual || 0;
    });
    return total;
  }, [fixedCategories, choiceCategories, selectedFixed, variantChoices]);

  const currentPrice = isPackComplete ? pack.price : calculateIndividualTotal();
  const selectedCount = Array.from(selectedFixed).length + choiceCategories.length;

  const handleFixedToggle = (category: string, product: EquipmentOption) => {
    if (selectedFixed.has(category)) {
      if (selectedFixed.size === 1 && choiceCategories.length === 0) {
        toast.error("Debes tener al menos un producto seleccionado");
        return;
      }
      track("product_deselect_attempt", { pack: pack.id, product: `${product.brand} ${product.model}` });
      setPendingDeselect({ category, product });
    } else {
      setSelectedFixed((prev) => new Set([...prev, category]));
    }
  };

  const handleConfirmDeselect = () => {
    if (!pendingDeselect) return;
    track("product_deselect_confirmed", { pack: pack.id, product: `${pendingDeselect.product.brand} ${pendingDeselect.product.model}` });
    setSelectedFixed((prev) => {
      const next = new Set(prev);
      next.delete(pendingDeselect.category);
      return next;
    });
    setPendingDeselect(null);
  };

  const handleCancelDeselect = () => {
    if (pendingDeselect) {
      track("product_deselect_cancelled", { pack: pack.id, product: `${pendingDeselect.product.brand} ${pendingDeselect.product.model}` });
    }
    setPendingDeselect(null);
  };

  const priceWithoutPending = useMemo(() => {
    if (!pendingDeselect) return 0;
    return calculateIndividualTotal(pendingDeselect.category);
  }, [pendingDeselect, calculateIndividualTotal]);

  // Build breakdown for footer
  const productBreakdown = useMemo(() => {
    const items: { name: string; precio_en_pack: number; precio_individual: number; included: boolean }[] = [];
    fixedCategories.forEach((cat) => {
      const opt = cat.options[0];
      if (!opt) return;
      items.push({
        name: `${opt.brand} ${opt.model}`,
        precio_en_pack: opt.precio_en_pack || 0,
        precio_individual: opt.precio_individual || 0,
        included: selectedFixed.has(cat.category),
      });
    });
    choiceCategories.forEach((cat) => {
      const idx = variantChoices[cat.category] || 0;
      const opt = cat.options[idx];
      if (!opt) return;
      items.push({
        name: `${opt.brand} ${opt.model}`,
        precio_en_pack: opt.precio_en_pack || 0,
        precio_individual: opt.precio_individual || 0,
        included: true,
      });
    });
    return items;
  }, [fixedCategories, choiceCategories, selectedFixed, variantChoices]);

  const currentStageIdx = pack.stages.findIndex((s) => s.id === stageId);
  const nextStage = pack.stages[currentStageIdx + 1];

  const handleContinue = () => {
    track("checkout_start", {
      pack: pack.id,
      stage: stageId,
      is_pack_complete: isPackComplete,
      price: currentPrice,
      selected_count: selectedCount,
    });
    if (nextStage) {
      navigate(`/packs/${pack.id}/etapa/${nextStage.id}`);
    } else {
      navigate("/#precios");
    }
  };

  // Helper to render price info for a product
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

    // Not selected
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
            selectedCount={selectedCount}
            totalCount={totalCategoryCount}
            currentPrice={currentPrice}
            packPrice={pack.price}
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
                          handleFixedToggle(cat.category, opt);
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
          {choiceCategories.map((cat) => (
            <div key={cat.category} className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Elige tu {cat.category.toLowerCase()}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Selecciona la opción que mejor se adapte a ti</p>

              <RadioGroup
                value={String(variantChoices[cat.category] || 0)}
                onValueChange={(val) => {
                  setVariantChoices((prev) => ({ ...prev, [cat.category]: Number(val) }));
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {cat.options.map((opt, idx) => {
                  const isChosen = (variantChoices[cat.category] || 0) === idx;
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
                        {renderPriceInfo(opt, isChosen)}
                      </div>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          ))}

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
          packPrice={pack.price}
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
        packPrice={pack.price}
        isPackComplete={isPackComplete}
        selectedCount={selectedCount}
        totalCount={totalCategoryCount}
        products={productBreakdown}
        onContinue={handleContinue}
      />

      <Footer />
    </div>
  );
};

export default PackStageProducts;

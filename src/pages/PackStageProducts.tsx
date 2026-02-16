import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, CheckCircle } from "lucide-react";
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

  // Separate fixed and choice categories
  const { fixedCategories, choiceCategories, fixedKeys, totalCategoryCount } = useMemo(() => {
    if (!stage) return { fixedCategories: [] as EquipmentCategory[], choiceCategories: [] as EquipmentCategory[], fixedKeys: [] as string[], totalCategoryCount: 0 };
    const fixed = stage.products.filter((c) => c.type === "fixed");
    const choice = stage.products.filter((c) => c.type === "choice");
    const keys = fixed.map((c) => c.category);
    return { fixedCategories: fixed, choiceCategories: choice, fixedKeys: keys, totalCategoryCount: stage.products.length };
  }, [stage]);

  // State: selected fixed products (by category name)
  const [selectedFixed, setSelectedFixed] = useState<Set<string>>(() => new Set(fixedKeys));

  // State: variant choices (category → index)
  const [variantChoices, setVariantChoices] = useState<Record<string, number>>(() => {
    if (!stage) return {};
    const choices: Record<string, number> = {};
    stage.products.filter((c) => c.type === "choice").forEach((c) => { choices[c.category] = 0; });
    return choices;
  });

  // Modal state
  const [pendingDeselect, setPendingDeselect] = useState<{ category: string; product: EquipmentOption } | null>(null);

  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  if (!pack || !stage) return <Navigate to={packId ? `/packs/${packId}` : "/#precios"} replace />;

  // Price calculation
  const isPackComplete = fixedKeys.every((k) => selectedFixed.has(k));

  const calculateIndividualTotal = useCallback((withoutCategory?: string) => {
    let total = 0;
    // Fixed products that are selected
    fixedCategories.forEach((cat) => {
      if (withoutCategory === cat.category) return;
      if (selectedFixed.has(cat.category)) {
        total += cat.options[0]?.precio_individual || 0;
      }
    });
    // Choice products (always selected)
    choiceCategories.forEach((cat) => {
      const idx = variantChoices[cat.category] || 0;
      total += cat.options[idx]?.precio_individual || 0;
    });
    return total;
  }, [fixedCategories, choiceCategories, selectedFixed, variantChoices]);

  const currentPrice = isPackComplete ? pack.price : calculateIndividualTotal();

  // Count selected products (fixed selected + choice categories)
  const selectedCount = Array.from(selectedFixed).length + choiceCategories.length;

  // Handle fixed checkbox toggle
  const handleFixedToggle = (category: string, product: EquipmentOption) => {
    if (selectedFixed.has(category)) {
      // Trying to deselect
      // Check if this is the last product
      if (selectedFixed.size === 1 && choiceCategories.length === 0) {
        toast.error("Debes tener al menos un producto seleccionado");
        return;
      }
      track("product_deselect_attempt", { pack: pack.id, product: `${product.brand} ${product.model}` });
      setPendingDeselect({ category, product });
    } else {
      // Re-selecting
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

  // Price without the pending product (for modal)
  const priceWithoutPending = useMemo(() => {
    if (!pendingDeselect) return 0;
    // Calculate as if this category was removed
    let total = 0;
    fixedCategories.forEach((cat) => {
      if (cat.category === pendingDeselect.category) return;
      if (selectedFixed.has(cat.category)) {
        total += cat.options[0]?.precio_individual || 0;
      }
    });
    choiceCategories.forEach((cat) => {
      const idx = variantChoices[cat.category] || 0;
      total += cat.options[idx]?.precio_individual || 0;
    });
    return total;
  }, [pendingDeselect, fixedCategories, choiceCategories, selectedFixed, variantChoices]);

  // Build breakdown for footer
  const productBreakdown = useMemo(() => {
    const items: { name: string; precio_individual: number; included: boolean }[] = [];
    fixedCategories.forEach((cat) => {
      const opt = cat.options[0];
      if (!opt) return;
      const isSelected = selectedFixed.has(cat.category);
      if (!isSelected) return;
      items.push({
        name: `${opt.brand} ${opt.model}`,
        precio_individual: opt.precio_individual || 0,
        included: isPackComplete,
      });
    });
    choiceCategories.forEach((cat) => {
      const idx = variantChoices[cat.category] || 0;
      const opt = cat.options[idx];
      if (!opt) return;
      items.push({
        name: `${opt.brand} ${opt.model}`,
        precio_individual: opt.precio_individual || 0,
        included: isPackComplete,
      });
    });
    return items;
  }, [fixedCategories, choiceCategories, selectedFixed, variantChoices, isPackComplete]);

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

          {/* Low product warning */}
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

                      {/* Price label */}
                      {isSelected && isPackComplete ? (
                        <p className="text-xs font-medium text-primary flex items-center gap-1 mb-3">
                          <CheckCircle className="h-3 w-3" /> Incluido en pack
                        </p>
                      ) : isSelected ? (
                        <p className="text-xs font-medium text-orange-500 mb-3">
                          €{(opt.precio_individual || 0).toFixed(2)}/mes <span className="text-muted-foreground">(Precio individual)</span>
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mb-3">No incluido</p>
                      )}

                      {/* Checkbox */}
                      <label
                        className="flex items-center gap-2 cursor-pointer select-none"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFixedToggle(cat.category, opt);
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {}}
                        />
                        <span className="text-xs text-muted-foreground">Incluir en mi suscripción</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Choice products (variants) */}
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

                      {/* Price label */}
                      {isPackComplete ? (
                        <p className="text-xs font-medium text-primary flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Incluido sin coste
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-orange-500">
                          €{(opt.precio_individual || 0).toFixed(2)}/mes <span className="text-muted-foreground">(Precio individual)</span>
                        </p>
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          ))}

          {/* Navigation buttons */}
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

      {/* Deselection modal */}
      {pendingDeselect && (
        <DeselectionModal
          open={!!pendingDeselect}
          productName={`${pendingDeselect.product.brand} ${pendingDeselect.product.model}`}
          packPrice={pack.price}
          priceWithout={priceWithoutPending}
          onKeep={handleCancelDeselect}
          onRemove={handleConfirmDeselect}
        />
      )}

      {/* Product preview */}
      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => { if (!open) setPreviewProduct(null); }}
      />

      {/* Sticky price footer */}
      <StickyPriceFooter
        currentPrice={currentPrice}
        packPrice={pack.price}
        isPackComplete={isPackComplete}
        products={productBreakdown}
        onContinue={handleContinue}
      />

      <Footer />
    </div>
  );
};

export default PackStageProducts;

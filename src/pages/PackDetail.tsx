import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, CheckCircle, AlertTriangle, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import StickyPriceFooter from "@/components/packs/StickyPriceFooter";
import ProductPreviewDialog from "@/components/packs/ProductPreviewDialog";
import { getPackConfig } from "@/data/packStages";
import type { PackStage } from "@/data/packStages";
import type { EquipmentOption } from "@/data/planEquipment";
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
    isPackComplete,
    calculateTotalPrice,
    calculatePackCompletePrice,
    getGlobalCounts,
    getGlobalProductBreakdown,
    getSelectedItemsMap,
  } = usePackSelections(packId || "");

  const [activeTab, setActiveTab] = useState<string>("");
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

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
  const packPrice = pack ? calculatePackCompletePrice(pack) : 0;
  const complete = pack ? isPackComplete(pack) : true;
  const globalCounts = pack ? getGlobalCounts(pack) : { selectedCount: 0, totalCount: 0 };
  const productBreakdown = pack ? getGlobalProductBreakdown(pack) : [];

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
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen bg-background pb-32">
        <Header />

        <section className="pt-28 pb-8 md:pt-36 px-4">
          <div className="container max-w-3xl">
            <PackBreadcrumbs packName={pack.name} packId={pack.id} />

            <div className="text-center space-y-2 mb-6">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                {pack.name}
              </h1>
              <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                {pack.tagline}
              </p>
            </div>

            {/* Info banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-foreground space-y-1">
                  <p className="font-medium">Tu pack incluye todo el equipamiento que necesitas</p>
                  <p className="text-muted-foreground text-xs">
                    Te lo entregamos por etapas según crece tu bebé. Todos los productos incluidos tienen{" "}
                    <strong className="text-foreground">precio de pack</strong>. Si quitas algún producto, los restantes
                    pasan a precio individual (más alto).
                  </p>
                </div>
              </div>
            </div>

            {/* How it works accordion */}
            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="how" className="border rounded-xl px-4">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  ¿Cómo funciona Bebloo?
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground space-y-3">
                  <div>
                    <p className="font-medium text-foreground mb-1">Suscripción mensual, todo incluido</p>
                    <p>Pagas una cuota mensual fija y recibes todo el equipamiento de puericultura que necesitas. Sin compras, sin almacenamiento, sin preocupaciones.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Entrega por etapas</p>
                    <p>No te enviamos todo de golpe. Según tu bebé crece, te entregamos el equipamiento de cada etapa (por ejemplo: cuna al nacer, trona a los 6 meses, etc.).</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Precio de pack vs. individual</p>
                    <p>Cuando mantienes todos los productos, disfrutas del <strong className="text-foreground">precio de pack</strong> (el más bajo). Si quitas algún producto, los restantes pasan a <strong className="text-foreground">precio individual</strong>, que es significativamente más alto. Por eso el total puede subir al quitar un producto.</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">¿Puedo cambiar algo después?</p>
                    <p>Sí, puedes contactarnos para ajustar tu selección en cualquier momento. Nos adaptamos a ti.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
                    isPackComplete={complete}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Sticky footer with dynamic feedback */}
        <StickyPriceFooter
          currentPrice={Math.round(currentPrice)}
          packPrice={Math.round(packPrice)}
          isPackComplete={complete}
          selectedCount={globalCounts.selectedCount}
          totalCount={globalCounts.totalCount}
          products={productBreakdown}
          serviceFee={pack.serviceFee}
          onContinue={handleContinue}
        />

        <ProductPreviewDialog
          product={previewProduct}
          open={!!previewProduct}
          onOpenChange={(open) => !open && setPreviewProduct(null)}
        />
        <Footer />
      </div>
    </TooltipProvider>
  );
};

/* ── Stage panel (rendered inside each tab) ── */

interface StagePanelProps {
  stage: PackStage;
  getStageSelections: (stageId: string) => any;
  onToggle: (stageId: string, category: string, type: "fixed" | "choice") => void;
  onVariantChange: (stageId: string, category: string, idx: number) => void;
  onPreview: (product: EquipmentOption) => void;
  isPackComplete: boolean;
}

const StagePanel = ({ stage, getStageSelections, onToggle, onVariantChange, onPreview, isPackComplete }: StagePanelProps) => {
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
                <FixedProductRow product={cat.options[0]} onPreview={onPreview} isPackComplete={isPackComplete} />
              ) : (
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
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-medium text-primary">
                          €{(opt.precio_en_pack || 0).toFixed(0)}/mes
                        </span>
                        <PriceTooltip packPrice={opt.precio_en_pack || 0} individualPrice={opt.precio_individual || 0} isPackComplete={isPackComplete} />
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

/* ── Price tooltip ── */
const PriceTooltip = ({ packPrice, individualPrice, isPackComplete }: { packPrice: number; individualPrice: number; isPackComplete: boolean }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button type="button" className="p-0.5 text-muted-foreground hover:text-foreground transition-colors" onClick={(e) => e.preventDefault()}>
        <HelpCircle className="h-3 w-3" />
      </button>
    </TooltipTrigger>
    <TooltipContent side="top" className="max-w-[200px] text-xs">
      <p>
        <span className="font-medium">Pack:</span> €{packPrice.toFixed(0)}/mes
        {" · "}
        <span className="font-medium">Individual:</span> €{individualPrice.toFixed(0)}/mes
      </p>
      {!isPackComplete && (
        <p className="text-orange-400 mt-1">Precio individual aplicado</p>
      )}
    </TooltipContent>
  </Tooltip>
);

const FixedProductRow = ({ product, onPreview, isPackComplete }: { product: EquipmentOption; onPreview: (p: EquipmentOption) => void; isPackComplete: boolean }) => {
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
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs font-medium text-primary">
          €{(product.precio_en_pack || 0).toFixed(0)}/mes
        </span>
        <PriceTooltip
          packPrice={product.precio_en_pack || 0}
          individualPrice={product.precio_individual || 0}
          isPackComplete={isPackComplete}
        />
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

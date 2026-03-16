import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SelectionSidebar from "@/components/configurator/SelectionSidebar";
import CategorySection from "@/components/configurator/CategorySection";
import StickyMobileBar from "@/components/configurator/StickyMobileBar";
import CheckoutOptionsDialog from "@/components/configurator/CheckoutOptionsDialog";
import ProductDetailDialog from "@/components/catalog/ProductDetailDialog";
import type { CheckoutProduct } from "@/components/configurator/CheckoutOptionsDialog";
import { Button } from "@/components/ui/button";
import { useSelection } from "@/hooks/useSelection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  QuestionnaireAnswers,
  buildSituationSummary,
  getStageSuggestions,
} from "@/data/recommendationEngine";
import {
  Product,
  ProductCategory,
  PRODUCT_CATALOG,
  getProductById,
  getProductsByCategory,
  STAGE_LABELS,
  ALL_STAGES,
} from "@/data/productCatalog";

const STAGE_CATEGORIES: Record<string, ProductCategory[]> = {
  "0-4": ["movilidad", "descanso", "porteo", "extras"],
  "4-8": ["alimentacion", "extras"],
  "8-12": ["extras"],
  "12-24": ["movilidad", "descanso", "extras"],
};

function productsForStage(stage: string): (p: Product) => boolean {
  return (p) => p.stage === stage || (stage === "0-4" && p.stage === "ambas") || (stage === "4-8" && p.stage === "ambas");
}

export default function Selection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { track } = useAnalytics();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = (product: Product) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  const state = location.state as {
    answers?: QuestionnaireAnswers;
    recommended?: string[];
    preselectedProduct?: string;
  } | null;

  const hasState = !!state?.recommended && !!state?.answers;

  const initialProducts = useMemo(
    () =>
      hasState
        ? (state.recommended!.map(getProductById).filter(Boolean) as Product[])
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    productList,
    totalPrice,
    addProduct,
    removeProduct,
    swapProduct,
    isSelected,
    count,
    getDuration,
    setDuration,
    getDiscountedPrice,
  } = useSelection(initialProducts, state?.answers);

  // Handle preselected product from catalog
  useEffect(() => {
    if (state?.preselectedProduct) {
      const p = getProductById(state.preselectedProduct);
      if (p && !isSelected(p.id)) {
        addProduct(p);
      }
      // Clear state to prevent re-adding on re-render
      window.history.replaceState({}, "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stageSuggestions = useMemo(() => getStageSuggestions(), []);

  const allProductsByCategory = useMemo(() => {
    const map: Record<ProductCategory, Product[]> = {
      movilidad: [],
      descanso: [],
      porteo: [],
      alimentacion: [],
      extras: [],
    };
    PRODUCT_CATALOG.forEach((p) => map[p.category].push(p));
    return map;
  }, []);

  useEffect(() => {
    if (hasState) {
      track("recommendation_view", { productCount: initialProducts.length });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const situationSummary = hasState ? buildSituationSummary(state.answers!) : null;

  const getSelectedForCategory = (cat: ProductCategory): Product | undefined =>
    productList.find((p) => p.category === cat);

  const getAlternatives = (cat: ProductCategory, selectedId?: string): Product[] =>
    getProductsByCategory(cat).filter((p) => p.id !== selectedId);

  const getSuggestedForCategory = (cat: ProductCategory): Product[] =>
    stageSuggestions.filter((p) => p.category === cat);

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  const checkoutItems: CheckoutProduct[] = productList.map((p) => ({
    product: p,
    months: getDuration(p.id),
    originalPrice: p.pricePerMonth,
    discountedPrice: getDiscountedPrice(p),
  }));

  const renderStageSection = (stage: string, isFirst: boolean) => {
    const categories = STAGE_CATEGORIES[stage] ?? [];
    const stageFilter = productsForStage(stage);

    return (
      <section key={stage} className="space-y-6">
        <div>
          <h2 className="text-lg font-serif">{STAGE_LABELS[stage]}</h2>
          {!isFirst && (
            <p className="text-xs text-muted-foreground mt-1">
              Productos para cuando tu bebé crezca
            </p>
          )}
        </div>
        {categories.map((cat) => {
          const products = allProductsByCategory[cat].filter(stageFilter);
          if (products.length === 0) return null;
          const selected = getSelectedForCategory(cat);
          const isSelectedInStage = selected && stageFilter(selected);
          return (
            <CategorySection
              key={`${stage}-${cat}`}
              category={cat}
              selectedProduct={isSelectedInStage ? selected : undefined}
              alternatives={isSelectedInStage ? getAlternatives(cat, selected!.id).filter(stageFilter) : []}
              suggestedProducts={products.filter((p) => !isSelected(p.id) && p.id !== selected?.id)}
              isSelected={isSelected}
              onSwap={swapProduct}
              onRemove={removeProduct}
              onAdd={addProduct}
              stageBadge={!isFirst ? `Recomendado ${STAGE_LABELS[stage]}` : undefined}
              getDuration={getDuration}
              setDuration={setDuration}
              getDiscountedPrice={getDiscountedPrice}
              onPreview={handlePreview}
            />
          );
        })}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-28 md:pb-12 px-4 md:px-6">
        <div className="container max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
              {hasState ? "Tu selección bebloo" : "Elige lo que necesitas"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {hasState ? situationSummary : "Explora nuestro catálogo y monta tu selección a medida"}
            </p>
          </div>

          {/* Contextual banner */}
          {hasState ? (
            <div className="mb-8 rounded-xl bg-primary/10 border border-primary/20 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary-foreground shrink-0" />
                <p className="text-sm text-foreground">
                  Selección basada en tu cuestionario
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs shrink-0"
                onClick={() => navigate("/configurador")}
              >
                Repetir cuestionario
              </Button>
            </div>
          ) : (
            <div className="mb-8 rounded-xl bg-secondary border border-border p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary-foreground shrink-0" />
                <p className="text-sm text-foreground">
                  ¿Quieres que te ayudemos a elegir?
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs shrink-0 gap-1.5"
                onClick={() => navigate("/configurador")}
              >
                Hacer cuestionario
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-10">
              {ALL_STAGES.map((stage, i) => renderStageSection(stage, i === 0))}

              <div className="text-center py-4">
                <Link to="/catalogo" className="text-sm text-primary-foreground underline underline-offset-4 hover:opacity-80">
                  ¿No encuentras algo? Ver catálogo completo
                </Link>
              </div>
            </div>

            {!isMobile && (
              <div className="w-80 shrink-0">
                <SelectionSidebar
                  products={productList}
                  totalPrice={totalPrice}
                  onRemove={removeProduct}
                  onCheckout={handleCheckout}
                  getDuration={getDuration}
                  setDuration={setDuration}
                  getDiscountedPrice={getDiscountedPrice}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {isMobile && (
        <StickyMobileBar
          count={count}
          totalPrice={totalPrice}
          onCheckout={handleCheckout}
          products={productList}
          onRemove={removeProduct}
          getDuration={getDuration}
          setDuration={setDuration}
          getDiscountedPrice={getDiscountedPrice}
        />
      )}

      <CheckoutOptionsDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={checkoutItems}
        totalPrice={totalPrice}
      />
    </div>
  );
}

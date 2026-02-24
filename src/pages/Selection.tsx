import { useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import SelectionSidebar from "@/components/configurator/SelectionSidebar";
import CategorySection from "@/components/configurator/CategorySection";
import StickyMobileBar from "@/components/configurator/StickyMobileBar";
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
} from "@/data/productCatalog";

const STAGE_04_CATEGORIES: ProductCategory[] = ["movilidad", "descanso", "porteo", "extras"];
const STAGE_48_CATEGORIES: ProductCategory[] = ["alimentacion", "extras"];

export default function Selection() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { track } = useAnalytics();

  const state = location.state as {
    answers?: QuestionnaireAnswers;
    recommended?: string[];
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
  } = useSelection(initialProducts, state?.answers);

  const stageSuggestions = useMemo(() => getStageSuggestions(), []);

  // For free access: all products organized by category
  const allProductsByCategory = useMemo(() => {
    if (hasState) return null;
    const map: Record<ProductCategory, Product[]> = {
      movilidad: [],
      descanso: [],
      porteo: [],
      alimentacion: [],
      extras: [],
    };
    PRODUCT_CATALOG.forEach((p) => map[p.category].push(p));
    return map;
  }, [hasState]);

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
    const items = productList.map((p) => `• ${p.name} (${p.pricePerMonth}€/mes)`).join("\n");
    const msg = encodeURIComponent(
      `¡Hola! Me gustaría contratar estos productos:\n\n${items}\n\nTotal: ${totalPrice}€/mes`
    );
    window.open(`https://wa.me/34600000000?text=${msg}`, "_blank");
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
              {hasState ? situationSummary : "Explora nuestro catálogo y monta tu pack a medida"}
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
              {hasState ? (
                <>
                  {/* Questionnaire-based view */}
                  <section className="space-y-6">
                    <h2 className="text-lg font-serif">{STAGE_LABELS["0-4"]}</h2>
                    {STAGE_04_CATEGORIES.map((cat) => {
                      const selected = getSelectedForCategory(cat);
                      const alts = getAlternatives(cat, selected?.id);
                      return (
                        <CategorySection
                          key={cat}
                          category={cat}
                          selectedProduct={selected}
                          alternatives={alts}
                          suggestedProducts={[]}
                          isSelected={isSelected}
                          onSwap={swapProduct}
                          onRemove={removeProduct}
                          onAdd={addProduct}
                        />
                      );
                    })}
                  </section>

                  <section className="space-y-6">
                    <div>
                      <h2 className="text-lg font-serif">{STAGE_LABELS["4-8"]}</h2>
                      <p className="text-xs text-muted-foreground mt-1">
                        Productos opcionales para cuando tu bebé crezca
                      </p>
                    </div>
                    {STAGE_48_CATEGORIES.map((cat) => {
                      const suggested = getSuggestedForCategory(cat);
                      if (suggested.length === 0) return null;
                      const selected = getSelectedForCategory(cat);
                      return (
                        <CategorySection
                          key={`48-${cat}`}
                          category={cat}
                          selectedProduct={selected?.stage === "4-8" ? selected : undefined}
                          alternatives={selected?.stage === "4-8" ? getAlternatives(cat, selected.id) : []}
                          suggestedProducts={suggested.filter((p) => !isSelected(p.id))}
                          isSelected={isSelected}
                          onSwap={swapProduct}
                          onRemove={removeProduct}
                          onAdd={addProduct}
                          stageBadge="Recomendado etapa 4-8"
                        />
                      );
                    })}
                  </section>
                </>
              ) : (
                <>
                  {/* Free access: full catalog */}
                  {allProductsByCategory && (
                    <>
                      <section className="space-y-6">
                        <h2 className="text-lg font-serif">{STAGE_LABELS["0-4"]}</h2>
                        {STAGE_04_CATEGORIES.map((cat) => {
                          const products = allProductsByCategory[cat].filter(
                            (p) => p.stage === "0-4" || p.stage === "ambas"
                          );
                          if (products.length === 0) return null;
                          const selected = getSelectedForCategory(cat);
                          return (
                            <CategorySection
                              key={cat}
                              category={cat}
                              selectedProduct={selected?.stage !== "4-8" ? selected : undefined}
                              alternatives={selected && selected.stage !== "4-8" ? getAlternatives(cat, selected.id).filter(p => p.stage !== "4-8") : []}
                              suggestedProducts={products.filter((p) => !isSelected(p.id) && p.id !== selected?.id)}
                              isSelected={isSelected}
                              onSwap={swapProduct}
                              onRemove={removeProduct}
                              onAdd={addProduct}
                            />
                          );
                        })}
                      </section>

                      <section className="space-y-6">
                        <div>
                          <h2 className="text-lg font-serif">{STAGE_LABELS["4-8"]}</h2>
                          <p className="text-xs text-muted-foreground mt-1">
                            Productos opcionales para cuando tu bebé crezca
                          </p>
                        </div>
                        {STAGE_48_CATEGORIES.map((cat) => {
                          const products = allProductsByCategory[cat].filter(
                            (p) => p.stage === "4-8"
                          );
                          if (products.length === 0) return null;
                          const selected = getSelectedForCategory(cat);
                          return (
                            <CategorySection
                              key={`48-${cat}`}
                              category={cat}
                              selectedProduct={selected?.stage === "4-8" ? selected : undefined}
                              alternatives={selected?.stage === "4-8" ? getAlternatives(cat, selected.id).filter(p => p.stage === "4-8") : []}
                              suggestedProducts={products.filter((p) => !isSelected(p.id) && p.id !== selected?.id)}
                              isSelected={isSelected}
                              onSwap={swapProduct}
                              onRemove={removeProduct}
                              onAdd={addProduct}
                              stageBadge="Recomendado etapa 4-8"
                            />
                          );
                        })}
                      </section>
                    </>
                  )}
                </>
              )}

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
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {isMobile && (
        <StickyMobileBar count={count} totalPrice={totalPrice} onCheckout={handleCheckout} />
      )}
    </div>
  );
}

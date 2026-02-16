import { useState, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import PriceSummary from "@/components/packs/PriceSummary";
import ProductPreviewDialog from "@/components/plan/ProductPreviewDialog";
import { getPackConfig, getPackStage } from "@/data/packStages";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { EquipmentOption } from "@/data/planEquipment";

const PackStageProducts = () => {
  const { packId, stageId } = useParams<{ packId: string; stageId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const pack = packId ? getPackConfig(packId) : undefined;
  const stage = packId && stageId ? getPackStage(packId, stageId) : undefined;

  // Build flat product list + keys
  const { allProducts, allKeys } = useMemo(() => {
    if (!stage) return { allProducts: [] as EquipmentOption[], allKeys: [] as string[] };
    const prods: EquipmentOption[] = [];
    const keys: string[] = [];
    stage.products.forEach((cat) => {
      cat.options.forEach((opt) => {
        prods.push(opt);
        keys.push(`${cat.category}::${opt.brand} ${opt.model}`);
      });
    });
    return { allProducts: prods, allKeys: keys };
  }, [stage]);

  // All selected by default
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set(allKeys));
  const [previewProduct, setPreviewProduct] = useState<EquipmentOption | null>(null);

  if (!pack || !stage) return <Navigate to={packId ? `/packs/${packId}` : "/packs"} replace />;

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const currentStageIdx = pack.stages.findIndex((s) => s.id === stageId);
  const nextStage = pack.stages[currentStageIdx + 1];

  return (
    <div className="min-h-screen bg-background pb-32">
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
            <p className="text-xs text-muted-foreground/70 italic">
              La selección es orientativa. Tu asesor personal te ayudará a elegir.
            </p>
          </div>

          {/* Product categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {stage.products.map((cat) => {
              const catHasSelected = cat.options.some((opt) =>
                selectedKeys.has(`${cat.category}::${opt.brand} ${opt.model}`)
              );
              return (
                <div
                  key={cat.category}
                  className={`rounded-xl border-2 bg-card p-6 transition-all ${
                    catHasSelected ? "border-primary/50 shadow-sm" : "border-border"
                  }`}
                >
                  <h4 className="font-semibold text-foreground mb-4 text-base">{cat.category}</h4>
                  <ul className="space-y-1">
                    {cat.options.map((opt) => {
                      const key = `${cat.category}::${opt.brand} ${opt.model}`;
                      const checked = selectedKeys.has(key);
                      return (
                        <li
                          key={key}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                            checked ? "bg-primary/5" : ""
                          }`}
                          onClick={() => toggleKey(key)}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleKey(key)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-sm flex-1 select-none leading-tight">
                            <span className="font-medium text-foreground">{opt.brand}</span>{" "}
                            <span className="text-muted-foreground">{opt.model}</span>
                            {opt.precio_individual ? (
                              <span className="text-xs text-muted-foreground/60 ml-1">
                                ({opt.precio_individual}&nbsp;€/mes)
                              </span>
                            ) : null}
                          </span>
                          {(opt.image || opt.description) && (
                            <button
                              type="button"
                              className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                              aria-label={`Ver ${opt.brand} ${opt.model}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewProduct(opt);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Price summary */}
          <PriceSummary
            packPrice={pack.price}
            allProducts={allProducts}
            selectedKeys={selectedKeys}
            allKeys={allKeys}
          />

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3 mt-8">
            {nextStage ? (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  track("pack_stage_next", { pack: pack.id, from: stageId, to: nextStage.id });
                  navigate(`/packs/${pack.id}/etapa/${nextStage.id}`);
                }}
              >
                Siguiente: {nextStage.name}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  track("cta_click", { location: "pack_stage_final", pack: pack.id });
                  navigate("/#precios");
                }}
              >
                Ver planes desde {pack.price}&nbsp;€/mes
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

      <ProductPreviewDialog
        product={previewProduct}
        open={!!previewProduct}
        onOpenChange={(open) => { if (!open) setPreviewProduct(null); }}
      />
      <FloatingCTA />
      <Footer />
    </div>
  );
};

export default PackStageProducts;

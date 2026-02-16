import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import { getPackConfig } from "@/data/packStages";
import { useAnalytics } from "@/hooks/useAnalytics";

const PackDetail = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const pack = packId ? getPackConfig(packId) : undefined;

  if (!pack) return <Navigate to="/packs" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-4">
        <div className="container max-w-4xl">
          <PackBreadcrumbs packName={pack.name} packId={pack.id} />

          <div className="text-center space-y-3 mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              {pack.name}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
              {pack.tagline}
            </p>
            <p className="text-2xl font-bold text-primary">{pack.price}&nbsp;€/mes</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pack.stages.map((stage, idx) => {
              const productCount = stage.products.reduce((s, c) => s + c.options.length, 0);
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    track("pack_stage_click", { pack: pack.id, stage: stage.id });
                    navigate(`/packs/${pack.id}/etapa/${stage.id}`);
                  }}
                  className="group rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {idx}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-xs text-primary/70 font-medium mb-2">{stage.subtitle}</p>
                  <p className="text-sm text-muted-foreground mb-4">{stage.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Package className="h-3.5 w-3.5" />
                      {productCount} producto{productCount !== 1 ? "s" : ""}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-14 space-y-3">
            <p className="text-muted-foreground text-sm">
              ¿Ya lo tienes claro? Contrata el pack completo y ahorra.
            </p>
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                track("cta_click", { location: "pack_detail_bottom", pack: pack.id });
                navigate("/#precios");
              }}
            >
              Ver planes desde {pack.price}&nbsp;€/mes
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <FloatingCTA />
      <Footer />
    </div>
  );
};

export default PackDetail;

import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowDown, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import PackBreadcrumbs from "@/components/packs/PackBreadcrumbs";
import { packStages, getTotalProductCount } from "@/data/packStages";
import { useAnalytics } from "@/hooks/useAnalytics";

const packOrder = ["start", "comfort", "total-peace"] as const;

const Packs = () => {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  const handleHeroCTA = () => {
    track("cta_click", { location: "packs_hero", action: "scroll_to_pricing" });
    navigate("/#precios");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Todo lo que necesita,
            <br className="hidden sm:block" /> cuando lo necesita
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Alguien responsable ya pensó en esto. Descubre qué equipamiento
            acompaña cada etapa de tu bebé.
          </p>
          <Button size="lg" className="gap-2 mt-2" onClick={handleHeroCTA}>
            Ver planes desde 59&nbsp;€/mes
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Trust banner */}
      <section className="container max-w-3xl px-4 pb-8">
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 md:p-8 text-center">
          <p className="font-serif text-lg md:text-xl font-semibold text-foreground">
            Equipamiento premium rotativo desde 59&nbsp;€/mes
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Sin compras, sin acumulación. Todo llega limpio, revisado y a tiempo.
          </p>
          <Button className="gap-2 mt-4" onClick={handleHeroCTA}>
            Descubre los planes
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Pack cards */}
      <section className="container max-w-5xl px-4 pb-20">
        <PackBreadcrumbs />

        <div className="grid gap-6 md:grid-cols-3">
          {packOrder.map((packId) => {
            const pack = packStages[packId];
            if (!pack) return null;
            const productCount = getTotalProductCount(packId);
            const isPopular = packId === "comfort";

            return (
              <div
                key={packId}
                className={`relative rounded-2xl border-2 bg-card p-6 md:p-8 flex flex-col transition-all hover:shadow-lg ${
                  isPopular ? "border-primary shadow-md" : "border-border hover:border-primary/30"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" /> Más elegido
                  </span>
                )}

                <h3 className="font-serif text-xl font-bold text-foreground mb-1">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pack.tagline}</p>

                <p className="text-3xl font-bold text-primary mb-1">
                  {pack.price}&nbsp;€<span className="text-base font-normal text-muted-foreground">/mes</span>
                </p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 mb-6">
                  <Package className="h-3.5 w-3.5" />
                  {productCount} productos · 3 etapas
                </div>

                <div className="mt-auto">
                  <Button
                    className="w-full gap-2"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => {
                      track("cta_click", { location: "packs_card", pack: packId });
                      navigate(`/packs/${packId}`);
                    }}
                  >
                    Explorar pack
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 space-y-4">
          <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">
            ¿Lista para empezar?
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Elige tu plan y recibe todo el equipamiento en casa, listo para usar.
          </p>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => {
              track("cta_click", { location: "packs_bottom", action: "scroll_to_pricing" });
              navigate("/#precios");
            }}
          >
            Ver planes y empezar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <FloatingCTA />
      <Footer />
    </div>
  );
};

export default Packs;

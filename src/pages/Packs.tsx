import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import StageTab from "@/components/packs/StageTab";
import { packsByStage } from "@/data/packsByStage";
import { useAnalytics } from "@/hooks/useAnalytics";

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

      {/* Tabs */}
      <section className="container max-w-5xl px-4 pb-20">
        <Tabs defaultValue="0-3m" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-10">
            {packsByStage.map((stage) => (
              <TabsTrigger key={stage.id} value={stage.id} className="text-xs sm:text-sm">
                {stage.ageRange}
              </TabsTrigger>
            ))}
          </TabsList>

          {packsByStage.map((stage) => (
            <TabsContent key={stage.id} value={stage.id}>
              <StageTab stage={stage} />
            </TabsContent>
          ))}
        </Tabs>

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

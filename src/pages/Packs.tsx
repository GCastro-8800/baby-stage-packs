import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StageTab from "@/components/packs/StageTab";
import { packsByStage } from "@/data/packsByStage";

const Packs = () => {
  const navigate = useNavigate();

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

        {/* CTA */}
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
            onClick={() => navigate("/#precios")}
          >
            Ver planes y empezar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packs;

import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Catalog = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-5xl px-4 pt-24 pb-16">
        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Todos los productos</h1>
        <p className="text-muted-foreground mb-8">
          Próximamente podrás explorar nuestro catálogo completo. Mientras tanto, responde unas preguntas y te recomendamos lo que necesitas.
        </p>
        <Button onClick={() => navigate("/configurador")} className="gap-2">
          Ir al configurador
          <ArrowRight className="h-4 w-4" />
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;

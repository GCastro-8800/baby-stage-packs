import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  PRODUCT_CATALOG,
  CATEGORY_LABELS,
  STAGE_LABELS,
  type ProductCategory,
  type Product,
} from "@/data/productCatalog";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";

const ALL_CATEGORIES: ProductCategory[] = ["movilidad", "descanso", "porteo", "alimentacion", "extras"];

function groupByStage(products: Product[]): Record<string, Product[]> {
  const groups: Record<string, Product[]> = { "0-4": [], "4-8": [] };
  products.forEach((p) => {
    if (p.stage === "0-4" || p.stage === "ambas") groups["0-4"].push(p);
    if (p.stage === "4-8") groups["4-8"].push(p);
  });
  return groups;
}

const Catalog = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  const filtered = activeCategory
    ? PRODUCT_CATALOG.filter((p) => p.category === activeCategory)
    : PRODUCT_CATALOG;

  const grouped = groupByStage(filtered);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl px-4 pt-24 pb-20">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Todos los productos</h1>
        <p className="text-muted-foreground mb-6 max-w-xl">
          Explora nuestro catálogo de equipamiento premium para bebés. Alquila solo lo que necesitas, cuando lo necesitas.
        </p>

        {/* CTA Banner */}
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-foreground flex-1">
            ¿No sabes por dónde empezar? <span className="text-muted-foreground">Responde unas preguntas y te recomendamos lo que necesitas.</span>
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate("/configurador")} className="gap-1.5 shrink-0">
            Ir al configurador <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Todos
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Product grid by stage */}
        {(["0-4", "4-8"] as const).map((stage) => {
          const products = grouped[stage];
          if (!products.length) return null;
          return (
            <section key={stage} className="mb-12">
              <h2 className="text-xl font-serif text-foreground mb-5">{STAGE_LABELS[stage]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((p) => (
                  <CatalogProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Footer CTA */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground mb-3">¿Quieres una recomendación personalizada?</p>
          <Button onClick={() => navigate("/configurador")} className="gap-2">
            Ir al configurador <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;

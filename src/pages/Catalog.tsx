import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import {
  PRODUCT_CATALOG,
  CATEGORY_LABELS,
  STAGE_LABELS,
  ALL_STAGES,
  type ProductCategory,
  type Product,
} from "@/data/productCatalog";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import CatalogSearchBar from "@/components/catalog/CatalogSearchBar";
import ProductRequestCard from "@/components/catalog/ProductRequestCard";
import { useAnalytics } from "@/hooks/useAnalytics";

const ALL_CATEGORIES: ProductCategory[] = ["movilidad", "descanso", "porteo", "alimentacion", "extras"];

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function groupByStage(products: Product[]): Record<string, Product[]> {
  const groups: Record<string, Product[]> = {};
  ALL_STAGES.forEach((s) => (groups[s] = []));

  products.forEach((p) => {
    if (p.stage === "ambas") {
      // "ambas" means 0-4 and 4-8
      groups["0-4"].push(p);
      groups["4-8"].push(p);
    } else if (groups[p.stage]) {
      groups[p.stage].push(p);
    }
  });
  return groups;
}

function getSelectionCount(): number {
  try {
    const raw = localStorage.getItem("bebloo_selection");
    if (!raw) return 0;
    return JSON.parse(raw).productIds?.length ?? 0;
  } catch {
    return 0;
  }
}

const Catalog = () => {
  const navigate = useNavigate();
  const { track } = useAnalytics();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [selectionCount, setSelectionCount] = useState(getSelectionCount);
  const [searchQuery, setSearchQuery] = useState("");
  const noResultsTrackedRef = useRef<string>("");

  // Listen for storage changes (from CatalogProductCard adding items)
  useEffect(() => {
    const handleStorage = () => setSelectionCount(getSelectionCount());
    window.addEventListener("storage", handleStorage);
    const interval = setInterval(() => setSelectionCount(getSelectionCount()), 1000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory
      ? PRODUCT_CATALOG.filter((p) => p.category === activeCategory)
      : PRODUCT_CATALOG;
    const q = normalize(searchQuery);
    if (q.length > 0) {
      list = list.filter((p) => {
        const haystack = normalize(
          `${p.name} ${p.brand} ${p.description} ${CATEGORY_LABELS[p.category] ?? ""}`
        );
        return haystack.includes(q);
      });
    }
    return list;
  }, [activeCategory, searchQuery]);

  const grouped = groupByStage(filtered);
  const trimmedQuery = searchQuery.trim();
  const showEmptyState = trimmedQuery.length >= 2 && filtered.length === 0;

  // Track no-results once per query (debounced via effect)
  useEffect(() => {
    if (!showEmptyState) return;
    const key = trimmedQuery.toLowerCase();
    if (noResultsTrackedRef.current === key) return;
    const timeout = setTimeout(() => {
      noResultsTrackedRef.current = key;
      track("product_search_no_results", { query: trimmedQuery });
    }, 800);
    return () => clearTimeout(timeout);
  }, [showEmptyState, trimmedQuery, track]);


  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Catálogo de Equipamiento para Bebés"
        description="Explora nuestro catálogo de cochecitos, cunas, portabebés y más de marcas premium como Bugaboo, Babyzen y Stokke. Alquila solo lo que necesitas."
        path="/catalogo"
      />
      <Header />
      <main className="container max-w-6xl px-4 pt-24 pb-20">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Todos los productos</h1>
        <p className="text-muted-foreground mb-6 max-w-xl">
          Explora nuestro catálogo de equipamiento premium para bebés. Alquila solo lo que necesitas, cuando lo necesitas.
        </p>

        {/* Selection indicator */}
        {selectionCount > 0 && (
          <button
            onClick={() => navigate("/mi-seleccion")}
            className="mb-6 w-full rounded-xl bg-primary/10 border border-primary/20 p-3 flex items-center gap-3 hover:bg-primary/15 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-foreground flex-1 text-left">
              Tienes <strong>{selectionCount}</strong> producto{selectionCount > 1 ? "s" : ""} en tu selección
            </span>
            <span className="text-xs font-medium text-primary shrink-0">Ver selección →</span>
          </button>
        )}

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

        {/* Search bar */}
        <CatalogSearchBar value={searchQuery} onChange={setSearchQuery} />

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

        {/* Empty state with lead capture */}
        {showEmptyState && (
          <div className="mb-12">
            <ProductRequestCard query={trimmedQuery} />
          </div>
        )}

        {/* Product grid by stage */}
        {!showEmptyState &&
          ALL_STAGES.map((stage) => {
            const products = grouped[stage];
            if (!products || !products.length) return null;
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

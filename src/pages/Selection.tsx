import { useLocation, Navigate } from "react-router-dom";
import Header from "@/components/Header";

export default function Selection() {
  const location = useLocation();
  const state = location.state as { answers?: any; recommended?: string[] } | null;

  // If no state, redirect to configurator
  if (!state?.recommended) {
    return <Navigate to="/configurador" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto text-center">
          <h1 className="text-2xl md:text-4xl font-serif text-foreground mb-4">
            Tu selección personalizada
          </h1>
          <p className="text-muted-foreground mb-8">
            Página en construcción — Iteración 2
          </p>
          <p className="text-sm text-muted-foreground">
            Productos recomendados: {state.recommended.join(", ")}
          </p>
        </div>
      </main>
    </div>
  );
}

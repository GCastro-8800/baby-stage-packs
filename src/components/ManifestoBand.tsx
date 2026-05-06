import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

const ManifestoBand = () => {
  const navigate = useNavigate();
  const { track } = useAnalytics();

  return (
    <section className="px-4 md:px-6 py-24 md:py-36 bg-background">
      <div className="container max-w-3xl text-center reveal">
        <h2
          className="font-serif text-foreground text-balance mb-10"
          style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          Menos cosas. <em className="text-muted-foreground not-italic">Más calma.</em>
        </h2>
        <Button
          size="lg"
          onClick={() => {
            track("cta_click", { source: "manifesto_band", action: "configurador" });
            navigate("/configurador");
          }}
          className="cta-tension text-base px-8 py-6 h-auto rounded-full"
        >
          Empieza tu selección
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default ManifestoBand;

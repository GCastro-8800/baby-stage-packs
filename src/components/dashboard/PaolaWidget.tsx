import { ArrowUpRight } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

const CALENDLY_URL = "https://calendly.com/bebloo/asesoria";

interface PaolaWidgetProps {
  variant?: "full" | "compact";
}

export function PaolaWidget({ variant = "full" }: PaolaWidgetProps) {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("cta_click", { source: "dashboard_paola_widget", action: "calendly" });
  };

  return (
    <section
      aria-labelledby="paola-widget-heading"
      className="border-y border-foreground/10 py-12 md:py-16"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        {/* Retrato */}
        <div
          aria-hidden
          className="shrink-0 self-start md:self-auto"
        >
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-foreground/5 flex items-center justify-center">
            <span className="font-serif text-3xl md:text-4xl text-foreground/40">
              P
            </span>
            {/* TODO: reemplazar con foto real de Paola */}
          </div>
        </div>

        {/* Texto + CTA */}
        <div className="flex-1">
          <p className="eyebrow mb-3 text-[10px]">
            Tu Maternity Nurse
          </p>
          <h2
            id="paola-widget-heading"
            className="font-serif text-foreground mb-3"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Paola está aquí cuando la necesites.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 max-w-xl">
            ¿Dudas con el sueño, la lactancia o qué necesitas de verdad para tu
            bebé? Reserva una llamada con Paola. Sin coste, sin compromiso.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group inline-flex items-center gap-2 text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-1"
            style={{ transitionDuration: "400ms" }}
          >
            <span className="font-serif text-lg md:text-xl" style={{ fontWeight: 400 }}>
              Reservar llamada
            </span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <p className="mt-3 text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
            30 min · online · gratis
          </p>
        </div>
      </div>
    </section>
  );
}

import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Shipment } from "@/hooks/useSubscription";

interface CurrentKitSectionProps {
  lastDelivered: Shipment | undefined;
  hasSubscription: boolean;
}

export function CurrentKitSection({ lastDelivered, hasSubscription }: CurrentKitSectionProps) {
  const navigate = useNavigate();

  // Estado vacío — sin servicio
  if (!hasSubscription) {
    return (
      <section aria-labelledby="kit-heading" className="py-8 md:py-12">
        <p className="eyebrow mb-6 text-[10px]">Tu kit</p>
        <h2
          id="kit-heading"
          className="font-serif text-foreground mb-4"
          style={{
            fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          Aún no tienes piezas en casa.
        </h2>
        <p className="text-muted-foreground max-w-xl leading-relaxed mb-6">
          Cuando elijas tu primera selección, las piezas aparecerán aquí con la
          fecha en que llegaron a tu hogar.
        </p>
        <button
          onClick={() => navigate("/configurador")}
          className="group inline-flex items-center gap-2 text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-1"
        >
          <span className="font-serif text-lg" style={{ fontWeight: 400 }}>
            Empezar mi selección
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </section>
    );
  }

  const items = lastDelivered?.items ?? [];
  const since = lastDelivered?.delivered_date
    ? format(new Date(lastDelivered.delivered_date), "d 'de' MMMM", { locale: es })
    : null;

  return (
    <section aria-labelledby="kit-heading" className="py-8 md:py-12">
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <div>
          <p className="eyebrow mb-3 text-[10px]">Tu kit ahora</p>
          <h2
            id="kit-heading"
            className="font-serif text-foreground"
            style={{
              fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Piezas en casa
          </h2>
        </div>
        {since && (
          <p className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground shrink-0">
            Desde el {since}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-6">
          Tu primera entrega está en preparación. Pronto verás aquí las piezas
          que te acompañan.
        </p>
      ) : (
        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {items.map((item) => (
            <li
              key={item.key}
              className="py-5 flex items-baseline justify-between gap-6"
            >
              <div className="min-w-0">
                <p className="font-serif text-foreground text-lg md:text-xl truncate">
                  {item.name}
                </p>
                <p className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-1">
                  {item.brand}
                  {item.model ? ` · ${item.model}` : ""}
                </p>
              </div>
              <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground shrink-0">
                {item.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

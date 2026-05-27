import type { Stage } from "@/types/baby";

const MOMENTS: { id: Stage; label: string; range: string }[] = [
  { id: "prenatal", label: "En espera", range: "antes de nacer" },
  { id: "0-3m", label: "Primeros días", range: "0–3 meses" },
  { id: "3-6m", label: "Descubriendo", range: "3–6 meses" },
  { id: "6-9m", label: "Explorando", range: "6–9 meses" },
  { id: "9-12m", label: "Creciendo", range: "9–12 meses" },
  { id: "12m+", label: "Pequeño grande", range: "12 meses en adelante" },
];

interface BabyTimelineProps {
  currentStage: Stage | null;
}

export function BabyTimeline({ currentStage }: BabyTimelineProps) {
  if (!currentStage) return null;

  const currentIndex = MOMENTS.findIndex((m) => m.id === currentStage);

  return (
    <section aria-labelledby="timeline-heading" className="py-8 md:py-12">
      <p className="eyebrow mb-6 text-[10px]">Recorrido de tu bebé</p>
      <h2 id="timeline-heading" className="sr-only">
        Momentos del bebé
      </h2>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Línea base */}
          <div className="absolute top-3 left-0 right-0 h-px bg-foreground/15" />
          <ol className="relative grid grid-cols-6 gap-2">
            {MOMENTS.map((m, i) => {
              const isCurrent = i === currentIndex;
              const isPast = i < currentIndex;
              return (
                <li key={m.id} className="flex flex-col items-center text-center">
                  <span
                    aria-hidden
                    className={[
                      "block w-2 h-2 rounded-full mb-4 mt-2 transition-colors",
                      isCurrent
                        ? "bg-[hsl(var(--coral))] ring-4 ring-[hsl(var(--coral))]/15"
                        : isPast
                          ? "bg-foreground/60"
                          : "bg-foreground/20",
                    ].join(" ")}
                  />
                  <span
                    className={[
                      "font-serif leading-tight",
                      isCurrent ? "text-foreground" : "text-foreground/60",
                    ].join(" ")}
                    style={{ fontSize: "0.95rem" }}
                  >
                    {m.label}
                  </span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground mt-1">
                    {m.range}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Mobile: vertical */}
      <ol className="md:hidden space-y-4 relative pl-6">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-foreground/15" />
        {MOMENTS.map((m, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <li key={m.id} className="relative">
              <span
                aria-hidden
                className={[
                  "absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full",
                  isCurrent
                    ? "bg-[hsl(var(--coral))] ring-4 ring-[hsl(var(--coral))]/15"
                    : isPast
                      ? "bg-foreground/60"
                      : "bg-foreground/20",
                ].join(" ")}
              />
              <div className="flex items-baseline justify-between gap-3">
                <span
                  className={[
                    "font-serif",
                    isCurrent ? "text-foreground" : "text-foreground/60",
                  ].join(" ")}
                  style={{ fontSize: "1rem" }}
                >
                  {m.label}
                </span>
                <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                  {m.range}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

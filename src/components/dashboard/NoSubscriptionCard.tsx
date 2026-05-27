import { useNavigate } from "react-router-dom";

export function NoSubscriptionCard() {
  const navigate = useNavigate();

  return (
    <section aria-label="Tu servicio" className="space-y-4">
      <p className="eyebrow text-[10px]">Tu servicio</p>
      <h3
        className="font-serif text-foreground"
        style={{ fontSize: "clamp(1.5rem, 2.8vw, 2rem)", fontWeight: 400, lineHeight: 1.15 }}
      >
        Aún no hay un Momento en marcha.
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Cuando tú decidas, te ayudamos a montar el primero. Sin prisa.
      </p>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate("/configurador")}
          className="font-serif text-base text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
        >
          Ver selecciones
        </button>
      </div>
    </section>
  );
}

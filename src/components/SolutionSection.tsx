import { Check } from "lucide-react";

const solutions = [
  {
    title: "Packs por etapas",
    description: "Equipamiento seleccionado para cada etapa de desarrollo, empezando por 0–3 meses.",
  },
  {
    title: "Entrega y recogida incluidas",
    description: "Lo llevamos todo a tu puerta y lo recogemos cuando tu bebé esté listo para la siguiente etapa.",
  },
  {
    title: "Limpieza e inspección profesional",
    description: "Cada artículo se limpia con estándares hospitalarios, se revisa la seguridad y está listo para usar.",
  },
];

const SolutionSection = () => {
  return (
    <section className="py-12 px-4 md:py-20 md:px-6">
      <div className="container max-w-4xl">
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-serif text-foreground mb-3 md:mb-4">
            Cómo funciona bebloo
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Suscríbete. Recibe. Renueva. Así de simple.
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="flex gap-3 md:gap-4 p-4 md:p-6 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
                  {solution.title}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

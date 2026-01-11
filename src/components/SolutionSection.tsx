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
    <section className="py-20 px-6">
      <div className="container max-w-4xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Cómo funciona bebloo
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Suscríbete. Recibe. Renueva. Así de simple.
          </p>
        </div>

        <div className="space-y-6">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground">
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

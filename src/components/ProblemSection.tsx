import { Brain, Clock, Package, RefreshCcw } from "lucide-react";

const problems = [
  {
    icon: Brain,
    title: "Sobrecarga de decisiones",
    description: "Horas investigando qué cuna, monitor o columpio comprar — para usarlo solo 8 semanas.",
  },
  {
    icon: Clock,
    title: "Ciclos de vida cortos",
    description: "Los bebés superan el equipamiento más rápido de lo esperado. Lo que sirve hoy, no sirve el mes siguiente.",
  },
  {
    icon: Package,
    title: "Pesadilla de almacenamiento",
    description: "¿Vives en un apartamento? Buena suerte encontrando espacio para un moisés, hamaca y columpio que usarás brevemente.",
  },
  {
    icon: RefreshCcw,
    title: "Frustración al revender",
    description: "Publicar, negociar, quedar con desconocidos — solo para recuperar el 30% de lo que pagaste.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-12 px-4 md:py-20 md:px-6 bg-card">
      <div className="container max-w-4xl">
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-2xl md:text-4xl font-serif text-foreground mb-3 md:mb-4">
            Ser padre primerizo ya es bastante
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            ¿Por qué añadir más decisiones, más compras y más cosas que guardar?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-4 md:p-6 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
            >
              <problem.icon className="h-7 w-7 md:h-8 md:w-8 text-primary mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

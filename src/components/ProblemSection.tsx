import { Brain, Clock, Package, RefreshCcw } from "lucide-react";

const problems = [
  {
    icon: Brain,
    title: "Demasiadas decisiones",
    description: "Cunas, hamacas, monitores... Es fácil perderse entre tantas opciones cuando cada semana cuenta.",
  },
  {
    icon: Clock,
    title: "Todo cambia muy rápido",
    description: "Lo que hoy le queda perfecto, en unas semanas puede quedarse pequeño. El ritmo de un bebé no espera.",
  },
  {
    icon: Package,
    title: "¿Y dónde lo guardo?",
    description: "Moisés, hamaca, parque... El espacio en casa es limitado, y muchas cosas se usan solo unas semanas.",
  },
  {
    icon: RefreshCcw,
    title: "El tema de revender",
    description: "Fotos, mensajes, quedadas... Vender lo que ya no usas lleva tiempo y energía que no siempre sobra.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="container max-w-4xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Quizás te hayas preguntado...
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Son dudas que muchos padres comparten durante los primeros meses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
            >
              <problem.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
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

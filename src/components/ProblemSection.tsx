import { Brain, Clock, Package, RefreshCcw } from "lucide-react";

const problems = [
  {
    icon: Brain,
    title: "Decision overload",
    description: "Hours researching which crib, monitor, or swing to buy — only to use it for 8 weeks.",
  },
  {
    icon: Clock,
    title: "Short product lifecycles",
    description: "Babies outgrow equipment faster than you expect. What fits today is useless next month.",
  },
  {
    icon: Package,
    title: "Storage nightmare",
    description: "Living in an apartment? Good luck finding space for a bassinet, bouncer, and swing you'll use briefly.",
  },
  {
    icon: RefreshCcw,
    title: "Resale frustration",
    description: "Listing, negotiating, meeting strangers — just to recover 30% of what you paid.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 px-6 bg-card">
      <div className="container max-w-4xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            Sound familiar?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            First-time parents face the same exhausting cycle with baby equipment.
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

import { Check } from "lucide-react";

const solutions = [
  {
    title: "Stage-based packs",
    description: "Curated equipment for each developmental stage, starting with 0–3 months.",
  },
  {
    title: "Delivery & pickup included",
    description: "We bring everything to your door and collect it when your baby's ready for the next stage.",
  },
  {
    title: "Professional cleaning & inspection",
    description: "Every item is hospital-grade cleaned, safety-checked, and ready to use.",
  },
];

const SolutionSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="container max-w-4xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
            How bebloo works
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Subscribe. Receive. Swap. That's it.
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

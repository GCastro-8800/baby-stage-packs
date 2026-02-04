import { Package, Baby, Truck } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Package,
    title: "Elige tu pack",
    description: "Selecciona el plan que mejor se adapta a tu familia y etapa del bebé.",
  },
  {
    number: 2,
    icon: Baby,
    title: "Úsalo sin preocupaciones",
    description: "Disfruta de equipamiento premium, limpio y seguro. Nosotros nos encargamos del mantenimiento.",
  },
  {
    number: 3,
    icon: Truck,
    title: "Lo recogemos y renovamos",
    description: "Cuando tu bebé crece, recogemos todo y te enviamos el pack de la siguiente etapa.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-16 px-4 md:py-24 md:px-6 bg-step scroll-mt-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-10 md:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/40 text-primary-foreground text-xs font-semibold tracking-wide uppercase mb-4">
            Así de fácil
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            Cómo funciona bebloo
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            En solo 3 pasos, tendrás todo lo que necesitas para cada etapa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-background rounded-2xl p-6 md:p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-6 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                {step.number}
              </div>
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-5 mt-2">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

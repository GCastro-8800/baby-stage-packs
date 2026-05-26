import { Package, Baby, Truck } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Package,
    title: "Cuéntanos tu situación",
    description: "Responde 4 preguntas rápidas y te recomendamos lo que necesitas según tu etapa y estilo de vida.",
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
    description: "Cuando tu bebé crece, recogemos todo y te enviamos lo que necesita en su nueva etapa.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-24 md:py-36 px-4 md:px-6 scroll-mt-20">
      <div className="container max-w-5xl">
        <div className="text-center mb-16 md:mb-24">
          <p className="eyebrow mb-6">Así de fácil</p>
          <h2 className="font-serif text-foreground mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400 }}>
            Cómo funciona bebloo
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            En solo 3 pasos, tendrás todo lo que necesitas para cada momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="font-serif text-5xl md:text-6xl text-accent/60 mb-6" style={{ fontWeight: 300 }}>
                {String(step.number).padStart(2, "0")}
              </div>
              <step.icon className="h-6 w-6 text-foreground/60 mb-5" strokeWidth={1.25} />
              <h3 className="font-serif text-foreground mb-3" style={{ fontSize: "clamp(1.35rem, 2vw, 1.75rem)", fontWeight: 400 }}>
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

import { Check, X } from "lucide-react";

const rentBenefits = [
  "Pagas solo por el tiempo que lo usas",
  "Sin preocuparte por revender después",
  "Equipamiento siempre en perfecto estado",
  "Cambio de etapa automático",
  "Sin ocupar espacio de almacenamiento",
  "Cero decisiones de compra estresantes",
];

const buyProblems = [
  "Inversión inicial de +€2.000",
  "Horas buscando qué comprar",
  "Ocupa espacio en casa",
  "Lo usas solo 2-3 meses",
  "Revender es una pesadilla",
  "Pierdes el 70% del valor",
];

const ComparisonSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 bg-mint">
      <div className="container max-w-5xl">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            ¿Por qué alquilar?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Compara y decide qué tiene más sentido para tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Rent card */}
          <div className="bg-background rounded-2xl p-6 md:p-8 shadow-sm border-2 border-primary">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
                <Check className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground">
                Alquilar con bebloo
              </h3>
            </div>
            
            <ul className="space-y-4">
              {rentBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-foreground text-sm md:text-base">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy card */}
          <div className="bg-background/60 rounded-2xl p-6 md:p-8 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <X className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-muted-foreground">
                Comprar todo nuevo
              </h3>
            </div>
            
            <ul className="space-y-4">
              {buyProblems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground text-sm md:text-base line-through decoration-muted-foreground/50">{problem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;

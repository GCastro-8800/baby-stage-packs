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
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="container max-w-5xl">
        <div className="text-center mb-16 md:mb-24">
          <p className="eyebrow mb-6">El contraste</p>
          <h2 className="font-serif text-foreground mb-5" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400 }}>
            ¿Por qué alquilar?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Ahorra hasta un 60% frente a la compra directa. Compara y decide qué tiene más sentido para tu familia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Rent */}
          <div>
            <h3 className="font-serif text-foreground mb-8" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 400 }}>
              Alquilar con bebloo
            </h3>
            <ul className="space-y-5">
              {rentBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <Check className="h-4 w-4 text-accent mt-1.5 shrink-0" strokeWidth={1.5} />
                  <span className="text-foreground text-base leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Buy */}
          <div>
            <h3 className="font-serif text-muted-foreground mb-8" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontWeight: 400 }}>
              Comprar todo nuevo
            </h3>
            <ul className="space-y-5">
              {buyProblems.map((problem, index) => (
                <li key={index} className="flex items-start gap-4">
                  <X className="h-4 w-4 text-muted-foreground/60 mt-1.5 shrink-0" strokeWidth={1.5} />
                  <span className="text-muted-foreground text-base leading-relaxed line-through decoration-muted-foreground/30">{problem}</span>
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

import logoBugaboo from "@/assets/logo-bugaboo.png";
import logoStokke from "@/assets/logo-stokke.png";
import logoCybex from "@/assets/logo-cybex.png";
import logoBabyzen from "@/assets/logo-babyzen.png";

const brands = [
  { name: "Bugaboo", logo: logoBugaboo },
  { name: "Stokke", logo: logoStokke },
  { name: "Cybex", logo: logoCybex },
  { name: "Babyzen", logo: logoBabyzen },
];

const BrandLogosSection = () => {
  // Duplicamos las marcas para crear el loop infinito
  const allBrands = [...brands, ...brands];

  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-muted-foreground text-center mb-6 md:mb-8">
          Trabajamos con las mejores marcas
        </p>
        
        {/* Container con overflow hidden */}
        <div className="relative overflow-hidden">
          {/* Gradientes fade en los bordes */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />
          
          {/* Banda animada */}
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {allBrands.map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center gap-8 md:gap-12 px-6 md:px-10"
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;

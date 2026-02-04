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

// Crear secuencia más larga para evitar huecos en pantallas anchas
const sequence = Array.from({ length: 8 }, (_, i) => brands[i % brands.length]);

const BrandLogosSection = () => {
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
          
          {/* Pista animada: inline-flex + w-max para medir ancho real del contenido */}
          <div className="inline-flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused] motion-reduce:animate-none">
            {/* Grupo A */}
            <div className="flex shrink-0">
              {sequence.map((brand, index) => (
                <div
                  key={`a-${index}`}
                  className="flex-shrink-0 flex items-center justify-center px-6 md:px-10"
                >
                  {/* Caja fija para tamaño uniforme */}
                  <div className="w-24 md:w-32 h-10 md:h-12 flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
            {/* Grupo A duplicado (para loop infinito) */}
            <div className="flex shrink-0" aria-hidden="true">
              {sequence.map((brand, index) => (
                <div
                  key={`b-${index}`}
                  className="flex-shrink-0 flex items-center justify-center px-6 md:px-10"
                >
                  <div className="w-24 md:w-32 h-10 md:h-12 flex items-center justify-center">
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;

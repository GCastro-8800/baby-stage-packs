const brands = [
  { name: "Bugaboo", origin: "Holanda" },
  { name: "Stokke", origin: "Noruega" },
  { name: "Cybex", origin: "Alemania" },
  { name: "Babyzen", origin: "Francia" },
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
                className="flex-shrink-0 flex items-center gap-8 md:gap-12 px-4 md:px-6"
              >
                <div className="flex flex-col items-center min-w-[120px] md:min-w-[140px]">
                  <span className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                    {brand.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {brand.origin}
                  </span>
                </div>
                <span className="text-2xl text-muted-foreground/40">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;

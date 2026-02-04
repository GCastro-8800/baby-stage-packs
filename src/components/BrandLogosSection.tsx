const brands = [
  { name: "Bugaboo", origin: "Holanda" },
  { name: "Stokke", origin: "Noruega" },
  { name: "Cybex", origin: "Alemania" },
  { name: "Babyzen", origin: "Francia" },
];

const BrandLogosSection = () => {
  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <p className="text-sm uppercase tracking-widest text-muted-foreground text-center mb-6 md:mb-8">
          Trabajamos con las mejores marcas
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex flex-col items-center justify-center py-4 opacity-60 hover:opacity-100 transition-opacity duration-200 cursor-default"
            >
              <span className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
                {brand.name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {brand.origin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogosSection;

import babyStrollerImage from "@/assets/baby-yoyo-stroller.png";

const MissionSection = () => {
  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left column - Content */}
          <div className="order-2 lg:order-1">
            <p className="eyebrow mb-6">Nuestra misión</p>

            <h2 className="font-serif text-foreground mb-8 leading-tight" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400 }}>
              Usar no debería significar comprar
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
              Los bebés crecen increíblemente rápido. Lo que hoy les queda perfecto, mañana ya no sirve.
              Por eso creamos bebloo: para que disfrutes de equipamiento premium sin el estrés de comprar,
              almacenar y revender.
            </p>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Cada artículo que sale de nuestro almacén pasa por un proceso de limpieza con estándares
              hospitalarios y una inspección de seguridad exhaustiva. Porque tu tranquilidad es nuestra prioridad.
            </p>

            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div>
                <p className="font-serif text-foreground" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}>50+</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Familias</p>
              </div>
              <div>
                <p className="font-serif text-foreground" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}>100%</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Satisfacción</p>
              </div>
              <div>
                <p className="font-serif text-foreground" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 400 }}>0</p>
                <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Estrés</p>
              </div>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={babyStrollerImage}
                alt="Bebé en cochecito YOYO de Babyzen — equipamiento premium en alquiler con bebloo"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

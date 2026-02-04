import { Badge } from "@/components/ui/badge";
import missionImage from "@/assets/mother-carrier.png";

const MissionSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 bg-warm">
      <div className="container max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div className="order-2 lg:order-1">
            <Badge 
              variant="secondary" 
              className="mb-4 text-xs font-semibold tracking-wide uppercase bg-primary/20 text-primary-foreground border-0"
            >
              Nuestra misión
            </Badge>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-6 leading-tight">
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
            
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Familias felices</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Satisfacción</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-serif font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Estrés</p>
              </div>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="order-1 lg:order-2">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-secondary shadow-lg">
              <img
                src={missionImage}
                alt="Madre con su bebé en portabebé"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "María G.",
    rating: 5,
    text: "Increíble servicio. El equipamiento llegó impecable y cuando mi bebé creció, el cambio fue súper fácil. ¡Lo recomiendo 100%!",
    verified: true,
  },
  {
    name: "Carlos y Ana",
    rating: 5,
    text: "Como padres primerizos, no sabíamos ni por dónde empezar. bebloo nos quitó todo el estrés de encima. Gracias de corazón.",
    verified: true,
  },
  {
    name: "Laura M.",
    rating: 5,
    text: "Vivimos en un piso pequeño y no teníamos espacio para guardar todo. Con bebloo, usamos lo que necesitamos y listo. Genial.",
    verified: true,
  },
  {
    name: "Pedro R.",
    rating: 5,
    text: "La calidad del equipamiento es excepcional. Todo está como nuevo y la limpieza es impecable. Muy contentos con el servicio.",
    verified: true,
  },
  {
    name: "Sofía T.",
    rating: 5,
    text: "El soporte es fantástico. Tuve una duda y me respondieron al momento. Se nota que les importa de verdad.",
    verified: true,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 bg-card">
      <div className="container max-w-6xl">
        <div className="text-center mb-10 md:mb-14">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent text-accent" />
            ))}
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            Lo que dicen las familias
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Más de 50 familias ya confían en bebloo.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-foreground text-sm md:text-base leading-relaxed flex-grow mb-4">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{testimonial.name}</span>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary-foreground border-0">
                        Verificado
                      </Badge>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "María G.",
    location: "Madrid",
    text: "Increíble servicio. El equipamiento llegó impecable y cuando mi bebé creció, el cambio fue súper fácil.",
  },
  {
    name: "Carlos y Ana",
    location: "Barcelona",
    text: "Como padres primerizos, no sabíamos ni por dónde empezar. bebloo nos quitó todo el estrés de encima.",
  },
  {
    name: "Laura M.",
    location: "Valencia",
    text: "Vivimos en un piso pequeño y no teníamos espacio. Con bebloo, usamos lo que necesitamos y listo.",
  },
  {
    name: "Pedro R.",
    location: "Sevilla",
    text: "La calidad del equipamiento es excepcional. Todo está como nuevo y la limpieza es impecable.",
  },
  {
    name: "Sofía T.",
    location: "Bilbao",
    text: "El soporte es fantástico. Tuve una duda y me respondieron al momento. Se nota que les importa.",
  },
];

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="container max-w-3xl text-center reveal">
        <p className="eyebrow mb-10">Lo que dicen las familias</p>

        <p
          aria-live="polite"
          className="font-serif text-foreground text-balance leading-[1.15] mb-10"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 400, letterSpacing: "-0.015em" }}
        >
          <span className="text-muted-foreground/60 font-serif text-4xl align-top mr-1">“</span>
          {t.text}
          <span className="text-muted-foreground/60 font-serif text-4xl align-top ml-1">”</span>
        </p>

        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">{t.name}</span> · {t.location}
        </div>

        <div className="flex justify-center gap-1.5 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonio ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-foreground" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

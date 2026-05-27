import { useState, useEffect } from "react";

// TODO: confirmar con clientas ciudad real, Momento del bebé y foto si la ceden.
type Testimonial = {
  quote: string;
  name: string;
  city: string;
  moment: string;
  avatarUrl?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Increíble servicio. El equipamiento llegó impecable y cuando mi bebé creció, el cambio fue súper fácil.",
    name: "María G.",
    city: "Madrid",
    moment: "Bebé de 6 meses",
  },
  {
    quote:
      "Como padres primerizos, no sabíamos ni por dónde empezar. bebloo nos quitó todo el estrés de encima.",
    name: "Carlos y Ana",
    city: "Madrid",
    moment: "Recién nacido",
  },
  {
    quote:
      "Vivimos en un piso pequeño y no teníamos espacio. Usamos solo lo que necesitamos y listo.",
    name: "Laura M.",
    city: "Madrid",
    moment: "Bebé de 4 meses",
  },
  {
    quote:
      "La calidad del equipamiento es excepcional. Todo está como nuevo y la limpieza es impecable.",
    name: "Pedro R.",
    city: "Madrid",
    moment: "Bebé de 9 meses",
  },
  {
    quote:
      "El soporte es fantástico. Tuve una duda y me respondieron al momento. Se nota que les importa.",
    name: "Sofía T.",
    city: "Madrid",
    moment: "Embarazo",
  },
];

const Avatar = ({ name, url }: { name: string; url?: string }) => {
  const initial = name.trim().charAt(0).toUpperCase();
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="h-10 w-10 rounded-full flex items-center justify-center bg-muted text-foreground/70 font-serif text-base"
    >
      {initial}
    </span>
  );
};

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      7000,
    );
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  return (
    <section className="py-24 md:py-36 px-4 md:px-6">
      <div className="container max-w-3xl text-center reveal">
        <p className="eyebrow mb-12">Lo que dicen las familias</p>

        <p
          aria-live="polite"
          className="font-serif text-foreground text-balance leading-[1.15] mb-12"
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.015em",
          }}
        >
          <span className="text-muted-foreground/60 font-serif text-4xl align-top mr-1">
            "
          </span>
          {t.quote}
          <span className="text-muted-foreground/60 font-serif text-4xl align-top ml-1">
            "
          </span>
        </p>

        <span
          aria-hidden
          className="block h-px w-10 bg-foreground/30 mx-auto mb-6"
        />

        <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Avatar name={t.name} url={t.avatarUrl} />
          <div className="text-left">
            <span className="block text-foreground font-medium">{t.name}</span>
            <span className="block text-xs tracking-wide">
              {t.city} · {t.moment}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonio ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-foreground"
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

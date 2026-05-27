import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQ = { question: string; answer: string };
type Category = { id: string; label: string; items: FAQ[] };

// TODO: pendientes de confirmar — borradores marcados con [borrador].
const categories: Category[] = [
  {
    id: "higiene",
    label: "Higiene y cuidado",
    items: [
      {
        question: "¿Cómo limpiáis cada pieza entre familias?",
        answer:
          "Cada artículo pasa por inspección manual, limpieza con vapor a alta temperatura, productos hipoalergénicos y textiles a 60°C. Si una pieza no pasa el control de calidad, no vuelve a salir.",
      },
      {
        question: "¿Qué marcas utilizáis y por qué?",
        answer:
          "Trabajamos con Bugaboo, Stokke, BabyBjörn, Babyzen, Cybex y Maxi-Cosi, entre otras. Son marcas que conocemos a fondo tras cientos de restauraciones y que cumplen estándares de seguridad estrictos.",
      },
      {
        question: "¿Cómo sé que el equipo es seguro?",
        answer:
          "Revisamos componentes, tornillería y tejidos pieza por pieza antes de cada entrega. Todo equipo cumple la normativa europea vigente y se reemplaza al menor signo de desgaste estructural.",
      },
    ],
  },
  {
    id: "envio",
    label: "Envío y recogida",
    items: [
      {
        question: "¿En qué zonas hacéis entrega?",
        answer:
          "Actualmente operamos en Madrid y área metropolitana. Si estás en otra ciudad, escríbenos a info@bebloo.es y te avisaremos cuando lleguemos.",
      },
      {
        question: "¿Quién entrega y recoge el equipo?",
        answer:
          "Nuestro equipo se encarga de la entrega, el montaje básico si lo necesitas y la recogida cuando termines. No hay terceros entre nosotros y tu casa.",
      },
      {
        question: "¿Cuánto tarda la primera entrega?",
        answer:
          "Coordinamos contigo una franja en los días posteriores a la confirmación de tu selección. Si tienes una fecha clave (parto, viaje, mudanza), avísanos y la priorizamos.",
      },
    ],
  },
  {
    id: "cambios",
    label: "Cambios y devoluciones",
    items: [
      {
        question: "¿Puedo cambiar una pieza si mi bebé crece o no la usamos?",
        answer:
          "Sí. Cuando una pieza deja de servir, nos avisas y la sustituimos por la siguiente que necesites. La logística va incluida en el servicio.",
      },
      {
        question: "¿Hay permanencia?",
        answer:
          "Pedimos un compromiso mínimo de tres meses por pieza, porque ese es el tiempo en que tiene sentido el servicio. A partir de ahí, la mantienes el tiempo que decidas.",
      },
      {
        question: "¿Y si una pieza se daña en casa?",
        answer:
          "El desgaste normal está cubierto. Si hay un daño accidental importante, lo revisamos contigo sin sustos en la letra pequeña: el objetivo es que el servicio te quite estrés, no que te lo añada.",
      },
    ],
  },
  {
    id: "pago",
    label: "Pago y facturación",
    items: [
      {
        question: "¿Cómo se paga el servicio?",
        answer:
          "Un único pago seguro al inicio mediante Stripe, por el total del kit y la duración que elijas. Sin cargos recurrentes ni sorpresas.",
      },
      {
        question: "¿Recibo factura?",
        answer:
          "Sí, recibirás la factura en tu email tras el pago. Si necesitas datos fiscales concretos, indícalo en el checkout o escríbenos.",
      },
      {
        question: "¿Puedo ampliar o reducir mi selección después?",
        answer:
          "Sí. Puedes añadir piezas en cualquier momento desde tu cuenta, y nos coordinamos contigo para cualquier cambio en la duración.",
      },
    ],
  },
];

const allFaqs = categories.flatMap((c) => c.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQSection = () => {
  const [active, setActive] = useState(categories[0].id);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section
      id="faq"
      className="py-24 md:py-36 px-4 md:px-6 scroll-mt-20"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="container max-w-6xl">
        <div className="text-center mb-16 md:mb-20">
          <p className="eyebrow mb-6">Preguntas frecuentes</p>
          <h2
            className="font-serif text-foreground mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 400 }}
          >
            ¿Tienes dudas?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Respondemos por categoría para que encuentres rápido lo que buscas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-16">
          {/* Sidebar nav */}
          <nav aria-label="Categorías" className="md:sticky md:top-24 md:self-start">
            <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0">
              {categories.map((c) => {
                const isActive = c.id === active;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setActive(c.id)}
                      className={`block w-full text-left whitespace-nowrap md:whitespace-normal py-2 md:py-3 text-sm md:text-base transition-colors border-l-2 pl-3 md:pl-4 ${
                        isActive
                          ? "border-foreground text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Questions */}
          <div>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              key={current.id}
            >
              {current.items.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <AccordionTrigger
                    className="text-left font-serif text-foreground hover:no-underline py-7"
                    style={{
                      fontSize: "clamp(1.15rem, 1.6vw, 1.4rem)",
                      fontWeight: 400,
                    }}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pb-7 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

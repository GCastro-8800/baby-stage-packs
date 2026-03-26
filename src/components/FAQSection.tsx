import { Helmet } from "react-helmet-async";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona el servicio?",
    answer: "Muy sencillo: exploras nuestro catálogo, eliges los productos que necesitas y seleccionas la duración para cada uno. Nosotros nos encargamos de la entrega, el montaje y la recogida cuando termines. Tú solo disfrutas de tu bebé.",
  },
  {
    question: "¿Cómo funciona la limpieza del equipamiento?",
    answer: "Cada artículo pasa por un proceso de limpieza profesional con estándares hospitalarios. Usamos productos hipoalergénicos y realizamos una inspección de seguridad exhaustiva antes de cada entrega.",
  },
  {
    question: "¿Puedo cancelar o devolver en cualquier momento?",
    answer: "Sí, sin permanencia ni penalizaciones. Si decides que ya no necesitas un producto, nos avisas y pasamos a recogerlo sin coste adicional. Sin letras pequeñas.",
  },
  {
    question: "¿Qué marcas utilizáis?",
    answer: "Trabajamos con las marcas más reconocidas y seguras del mercado: Bugaboo, Stokke, BabyBjörn, Babyzen, Cybex, entre otras. Solo seleccionamos productos que cumplen con los más altos estándares de calidad y seguridad.",
  },
  {
    question: "¿En qué zonas hacéis entrega?",
    answer: "Actualmente operamos en Madrid y área metropolitana. Estamos expandiéndonos, así que si estás en otra ciudad, déjanos tu email y te avisaremos cuando lleguemos a tu zona.",
  },
  {
    question: "¿Por qué alquilar en vez de comprar?",
    answer: "El equipamiento de bebé se usa pocos meses. Alquilando accedes a productos premium por una fracción del precio, evitas acumular cosas que no vas a usar y contribuyes a alargar la vida útil del equipamiento. Mejor para ti y para el planeta.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 px-4 md:py-24 md:px-6 bg-background scroll-mt-20">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="container max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold tracking-wide uppercase mb-4">
            Preguntas frecuentes
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground mb-4">
            ¿Tienes dudas?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Aquí respondemos las preguntas más comunes sobre nuestro servicio.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-sm transition-shadow"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-medium text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;

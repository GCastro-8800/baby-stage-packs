import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona la limpieza del equipamiento?",
    answer: "Cada artículo pasa por un proceso de limpieza profesional con estándares hospitalarios. Usamos productos hipoalergénicos y realizamos una inspección de seguridad exhaustiva antes de cada entrega.",
  },
  {
    question: "¿Qué pasa cuando mi bebé crece y necesita otra etapa?",
    answer: "¡Muy fácil! Nos avisas cuando estés listo para el cambio, programamos la recogida del pack actual y te enviamos el de la siguiente etapa. Todo incluido en tu suscripción.",
  },
  {
    question: "¿Puedo cancelar en cualquier momento?",
    answer: "Sí, no hay permanencia. Si decides cancelar, simplemente nos avisas y pasamos a recoger todo. Sin penalizaciones ni letras pequeñas.",
  },
  {
    question: "¿Qué marcas utilizáis?",
    answer: "Trabajamos con las marcas más reconocidas y seguras del mercado: BabyBjörn, Stokke, Cybex, Maxi-Cosi, entre otras. Solo seleccionamos productos que cumplen con los más altos estándares de calidad y seguridad.",
  },
  {
    question: "¿En qué zonas hacéis entrega?",
    answer: "Actualmente operamos en Madrid y área metropolitana. Estamos expandiéndonos, así que si estás en otra ciudad, déjanos tu email y te avisaremos cuando lleguemos a tu zona.",
  },
  {
    question: "¿Qué incluye exactamente cada pack?",
    answer: "Cada pack está diseñado para cubrir las necesidades específicas de cada etapa. Puedes ver el detalle completo de cada plan en nuestra sección de precios. Si tienes dudas específicas, escríbenos.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4 md:py-24 md:px-6 bg-background">
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

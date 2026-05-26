import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { easeOutExpo, lineReveal, staggerContainer } from "@/lib/motion";
import { useAnalytics } from "@/hooks/useAnalytics";

const CALENDLY_URL = "https://calendly.com/bebloo/asesoria";

const PaolaConsultationSection = () => {
  const { track } = useAnalytics();

  const handleClick = () => {
    track("cta_click", { source: "paola_consultation", action: "calendly" });
  };

  return (
    <section
      id="asesoria-paola"
      className="px-4 py-24 md:px-6 md:py-36"
      aria-labelledby="paola-heading"
    >
      <div className="container max-w-4xl text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.p
            className="eyebrow mb-8 inline-flex items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
          >
            <motion.span
              aria-hidden
              className="block h-px bg-foreground/40 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: easeOutExpo }}
              style={{ width: 28 }}
            />
            Acompañamiento incluido · sin coste
          </motion.p>

          <h2
            id="paola-heading"
            className="font-serif text-foreground text-balance mb-10"
            style={{
              fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            <motion.span className="block overflow-hidden" variants={lineReveal} custom={0}>
              Habla con Paola antes
            </motion.span>
            <motion.span className="block overflow-hidden" variants={lineReveal} custom={1}>
              de decidir nada.
            </motion.span>
          </h2>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.2 }}
          >
            Paola es enfermera especializada en maternidad y cuidados del recién
            nacido, con experiencia en la sanidad pública acompañando a familias
            desde el embarazo hasta los primeros meses.
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.35 }}
          >
            Reserva una llamada gratuita y te ayudará a entender qué necesitas
            de verdad para tu bebé —y qué no— sin compromiso de contratar nada
            con nosotros.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.5 }}
          >
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="group inline-flex items-center gap-3 text-foreground border-b border-foreground/40 hover:border-foreground transition-colors pb-1"
              style={{ transitionDuration: "500ms" }}
            >
              <span className="font-serif text-xl md:text-2xl" style={{ fontWeight: 400 }}>
                Reservar llamada con Paola
              </span>
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <p className="mt-5 text-xs tracking-wide uppercase text-muted-foreground">
              30 minutos · online · gratis
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PaolaConsultationSection;

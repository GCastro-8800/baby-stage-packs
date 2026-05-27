import { motion } from "framer-motion";
import { easeOutExpo, lineReveal, staggerContainer } from "@/lib/motion";

// TODO: Validar con la fundadora el copy exacto de los 4 pasos
// antes de publicar. Borrador conservador, sin inventar certificaciones.
const steps = [
  {
    number: "01",
    title: "Devolución y recepción",
    body: "Cuando una familia termina, la pieza vuelve a nuestro taller en Madrid.",
  },
  {
    number: "02",
    title: "Inspección manual",
    body: "Revisamos cada componente, tornillería y tejido pieza por pieza.",
  },
  {
    number: "03",
    title: "Limpieza con estándares hospitalarios",
    body: "Vapor a alta temperatura, productos hipoalergénicos y textiles a 60°C.",
  },
  {
    number: "04",
    title: "Control de calidad",
    body: "Empaquetado individual y revisión final antes de la próxima familia.",
  },
];

const CareProcessSection = () => {
  return (
    <section
      id="cuidado"
      className="px-4 py-24 md:px-6 md:py-36"
      aria-labelledby="cuidado-heading"
    >
      <div className="container max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="text-center max-w-2xl mx-auto mb-20 md:mb-28"
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
            Cómo cuidamos cada pieza
          </motion.p>

          <h2
            id="cuidado-heading"
            className="font-serif text-foreground text-balance mb-6"
            style={{
              fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            <motion.span className="block overflow-hidden" variants={lineReveal} custom={0}>
              No es de segunda mano.
            </motion.span>
            <motion.span className="block overflow-hidden" variants={lineReveal} custom={1}>
              Es equipo restaurado a mano.
            </motion.span>
          </h2>

          <motion.p
            className="text-base md:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.2 }}
          >
            Cada pieza pasa por el mismo proceso antes de llegar a tu casa.
            Sin atajos.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x md:divide-foreground/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, ease: easeOutExpo, delay: 0.1 * i }}
              className="px-0 md:px-8 py-10 md:py-4 border-t border-foreground/10 md:border-t-0 first:border-t-0"
            >
              <span
                className="block font-serif text-muted-foreground/50 mb-5"
                style={{ fontSize: "clamp(2.4rem, 3.5vw, 3rem)", fontWeight: 400, lineHeight: 1 }}
              >
                {step.number}
              </span>
              <h3
                className="font-serif text-foreground mb-3"
                style={{ fontSize: "clamp(1.15rem, 1.5vw, 1.35rem)", fontWeight: 400, lineHeight: 1.2 }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.5 }}
          className="text-center text-sm md:text-base text-muted-foreground italic font-serif mt-20"
        >
          Si una pieza no pasa el control, no vuelve a salir.
        </motion.p>
      </div>
    </section>
  );
};

export default CareProcessSection;

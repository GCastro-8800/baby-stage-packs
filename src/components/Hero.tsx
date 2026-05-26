import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-premium.jpg";
import { useAnalytics } from "@/hooks/useAnalytics";
import { easeOutExpo, lineReveal, staggerContainer } from "@/lib/motion";

const TRUST_WORDS = [
  "Sin permanencia",
  "Envío y recogida incluidos",
  "Cambia el material cuando quieras",
  "Limpieza con estándares hospitalarios",
];

const Hero = () => {
  const { track } = useAnalytics();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  // Parallax on hero image (desktop, no reduced-motion)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 1.04]);

  const handleCtaClick = () => {
    track("cta_click", { source: "hero", action: "configurador" });
    navigate("/configurador");
  };

  const scrollToHow = () => {
    document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" });
  };

  // Magnetic hover (desktop only)
  const handleMagnet = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const resetMagnet = () => {
    if (ctaRef.current) ctaRef.current.style.transform = "translate(0, 0)";
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section grain-overlay min-h-[auto] lg:min-h-[88vh] flex items-center px-4 pt-24 pb-16 md:px-6 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28"
    >
      <div className="container max-w-6xl relative z-[1]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left column — content */}
          <motion.div
            className="order-2 lg:order-1 lg:col-span-6 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Eyebrow with drawn rule */}
            <motion.p
              className="eyebrow mb-6 inline-flex items-center gap-3 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.05 }}
            >
              <motion.span
                aria-hidden
                className="block h-px bg-foreground/40 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
                style={{ width: 28 }}
              />
              Equipamiento de bebé · en alquiler
            </motion.p>

            {/* H1 with two-line clip-path reveal */}
            <h1
              className="font-serif text-foreground text-balance mb-8"
              style={{ fontSize: "clamp(2.75rem, 6.2vw, 5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              <motion.span
                className="block overflow-hidden"
                variants={lineReveal}
                custom={0}
              >
                Lo mejor para tu bebé,
              </motion.span>
              <motion.span
                className="block overflow-hidden"
                variants={lineReveal}
                custom={1}
              >
                sin acumularlo en casa.
              </motion.span>
            </h1>

            <motion.p
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.45 }}
            >
              Equipamiento premium en alquiler. Cambia, devuelve y olvídate de revender. Sin permanencia.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.6 }}
            >
              <div
                ref={ctaRef}
                className="magnetic inline-block"
                onMouseMove={handleMagnet}
                onMouseLeave={resetMagnet}
              >
                <Button
                  size="lg"
                  onClick={handleCtaClick}
                  className="cta-tension text-base px-8 py-6 h-auto rounded-full"
                >
                  Empieza tu selección
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <button
                onClick={scrollToHow}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                Cómo funciona →
              </button>
            </motion.div>

            <motion.p
              className="mt-6 text-sm text-muted-foreground text-center lg:text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: easeOutExpo, delay: 0.9 }}
            >
              ¿Primer bebé y no sabes por dónde empezar?{" "}
              <a
                href="#asesoria-paola"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("asesoria-paola")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors"
              >
                Habla gratis con Paola, nuestra enfermera de maternidad
              </a>
              .
            </motion.p>
          </motion.div>

          {/* Right column — image with parallax */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-md lg:max-w-xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: easeOutExpo }}
            >
              <motion.div
                className="aspect-[4/5] overflow-hidden bg-secondary/40"
                style={{ y: imageY, scale: imageScale }}
              >
                <img
                  src={heroImage}
                  alt="Madre con cochecito premium en alquiler — bebloo"
                  className="w-full h-full object-cover"
                  width={1024}
                  height={1280}
                  fetchPriority="high"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Sub-band: trust strip with stagger */}
        <motion.div
          className="mt-14 md:mt-20 pt-8 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-between gap-x-10 gap-y-3 text-xs text-muted-foreground"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
        >
          {TRUST_WORDS.map((w) => (
            <motion.span
              key={w}
              className="tracking-wide"
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
              }}
            >
              {w}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

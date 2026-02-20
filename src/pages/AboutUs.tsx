import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Sparkles, Truck, Shield, ArrowRight, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import heroImg from "@/assets/about-hero-family.jpg";
import missionImg from "@/assets/mission-family.jpg";
import carrierImg from "@/assets/baby-playing.jpg";
import twinsImg from "@/assets/twins-happy.jpg";

/* ── scroll-reveal ────────────────────────────────────────── */

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
};

/* ── data ─────────────────────────────────────────────────── */

const principles = [
  {
    icon: CheckCircle,
    title: "Cero Decisiones",
    description: "Seleccionamos por ti. Marcas premium validadas tras cientos de restauraciones.",
  },
  {
    icon: Sparkles,
    title: "Higiene sin Compromiso",
    description: "Protocolos de limpieza grado hospitalario con tecnología UV-C.",
  },
  { icon: Truck, title: "Logística Invisible", description: "Entregamos, recogemos, rotamos. Sin cajas en tu portal." },
  {
    icon: Shield,
    title: "Confianza Total",
    description: "Cobertura completa ante daños accidentales. Sin letra pequeña.",
  },
];

const stats = [
  { value: "+400", label: "carritos restaurados" },
  { value: "+4", label: "años de experiencia" },
  { value: "100s", label: "de familias atendidas" },
];

/* ── editorial section ────────────────────────────────────── */

interface EditorialSectionProps {
  number: string;
  image: string;
  imageAlt: string;
  imageFirst?: boolean;
  title: string;
  children: React.ReactNode;
}

const EditorialSection = ({ number, image, imageAlt, imageFirst = false, title, children }: EditorialSectionProps) => (
  <section className="py-20 md:py-28 px-4">
    <div className="container max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image */}
        <Reveal className={imageFirst ? "lg:order-1" : "lg:order-2"}>
          <div className="aspect-[3/4] rounded-3xl overflow-hidden ring-1 ring-border/20 ring-offset-4 ring-offset-background">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover object-top" />
          </div>
        </Reveal>
        {/* Text */}
        <Reveal className={imageFirst ? "lg:order-2" : "lg:order-1"}>
          <div className="relative">
            <span className="block font-serif text-7xl md:text-8xl font-bold text-accent/15 leading-none mb-2 select-none">
              {number}
            </span>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground leading-tight -mt-4 md:-mt-6 relative z-10">
              {title}
            </h2>
          </div>
          <div className="mt-6">{children}</div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* ── page ─────────────────────────────────────────────────── */

const AboutUs = () => {
  useEffect(() => {
    document.title = "Quiénes Somos | Bebloo - Equipamiento Premium por Suscripción para Bebés en Madrid";
    const meta = document.querySelector('meta[name="description"]');
    const content =
      "Conoce a Bebloo: fundado por expertos con +4 años en el mercado de equipamiento infantil. Sabemos qué funciona porque lo hemos visto cientos de veces.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const tag = document.createElement("meta");
      tag.name = "description";
      tag.content = content;
      document.head.appendChild(tag);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ─── 1. Hero Full-Width ──────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Familia con carrito de bebé"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="relative z-10 text-center px-4 py-32 max-w-3xl mx-auto">
          <Reveal>
            <Badge className="mb-6 text-sm font-medium px-4 py-1.5 bg-white/15 text-white border-white/25 backdrop-blur-sm">
              Nuestra historia
            </Badge>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-6">
              Una inquietud real por el desperdicio nos enseñó lo que los padres realmente necesitan
            </h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
              Vimos cómo productos de calidad se usaban unos meses y se descartaban. Bebloo existe para romper ese ciclo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── 2. Somos Bebloo ─────────────────────────────── */}
      <EditorialSection
        number="01"
        image={missionImg}
        imageAlt="Familia disfrutando juntos"
        imageFirst
        title="Somos Bebloo"
      >
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Paola lleva desde niña fascinada con el mundo de los bebés. Pero lo que realmente la movía era una
            inquietud: la corta vida útil que se les da a los productos infantiles y el impacto medioambiental que eso
            genera. Esa convicción la llevó hace más de 4 años a dedicarse a alargar la vida útil de carritos y
            equipamiento de bebé, restaurándolos para que tuvieran una segunda oportunidad.
          </p>
          <p>
            Cientos de restauraciones después, el patrón era innegable: padres que compraban con ilusión, usaban el
            producto 3-4 meses, vendían con prisa… y meses después volvían a buscar lo mismo.
          </p>
          <blockquote className="border-none pl-0 py-6 my-4">
            <p className="text-2xl md:text-3xl font-serif font-medium text-foreground italic text-center">
              "Un ciclo absurdo, costoso y con un impacto innecesario."
            </p>
          </blockquote>
          <p>
            Gabriel, su pareja, compartía esa misma inquietud y llevaba dos años ayudándola. Juntos transformaron esa
            convicción en Bebloo: un servicio diseñado para que ningún producto se desperdicie y ningún padre tenga que
            pasar por ese ciclo otra vez.
          </p>
        </div>
      </EditorialSection>

      {/* ─── 3. La Idea ──────────────────────────────────── */}
      <EditorialSection number="02" image={carrierImg} imageAlt="Bebé jugando con juguetes" title="Lo que descubrimos">
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            La mayor parte de los padres que adquieren su equipo lo vuelven a vender después de algunos meses. Compra
            apresurada, uso corto, venta con pérdida.
          </p>
          <p>
            El problema no es el producto. Es el sistema de compra-acumulación-reventa. Nosotros lo sustituimos por un
            modelo circular: tú usas, nosotros rotamos.
          </p>
          <p>
            No venimos del mundo startup ni de consultorías. Venimos de restaurar productos a mano, de darles una
            segunda vida cuando otros los descartaban. Conocemos el mercado desde las trincheras.
          </p>
          <p className="text-xl font-serif font-semibold text-foreground">Esa experiencia es nuestra ventaja.</p>
        </div>
      </EditorialSection>

      {/* ─── 4. Nuestra Visión ───────────────────────────── */}
      <EditorialSection number="03" image={twinsImg} imageAlt="Gemelos felices" imageFirst title="Nuestra visión">
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Creemos que ser padre primerizo no debería venir con una lista interminable de decisiones de compra.
            Queremos que cada familia reciba exactamente lo que necesita, cuando lo necesita.
          </p>
          <p>
            Seleccionamos marcas premium validadas tras cientos de restauraciones. Aplicamos protocolos de higiene de
            grado hospitalario. Nos encargamos de toda la logística para que tú solo disfrutes.
          </p>
          <p>
            Empezamos en Madrid por una razón: control absoluto de la experiencia. Conocemos cada producto que sale de
            nuestro almacén.
          </p>
        </div>
      </EditorialSection>

      {/* ─── 5. Estadísticas ─────────────────────────────── */}
      <section className="py-14 md:py-20 px-4" style={{ background: "hsl(var(--step-bg))" }}>
        <div className="container max-w-4xl">
          <Reveal>
            <div className="grid grid-cols-3 gap-6 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <span className="block text-4xl md:text-6xl font-serif font-semibold text-accent">{s.value}</span>
                  <p className="text-sm md:text-base text-muted-foreground mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── 6. Principios (horizontal) ──────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-5xl">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground text-center mb-14">
              Nuestros principios
            </h2>
          </Reveal>
          <div className="space-y-8">
            {principles.map((p, i) => (
              <Reveal key={i}>
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-accent/20">
                    <p.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">{p.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CTA Final ────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-3xl text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-7 w-7 text-accent" />
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground mb-4">
              Nuestro compromiso con Madrid
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              <p>
                Empezamos hiperlocal por una razón: control absoluto de la experiencia. Conocemos cada producto que sale
                de nuestro almacén. Controlamos cada limpieza. Gestionamos cada entrega personalmente.
              </p>
              <p>
                No somos una plataforma. Somos un equipo dedicado exclusivamente a que tu primer año como padre sea más
                simple.
              </p>
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
              ¿Listo para dejar de decidir?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Solo necesitas dar el primer paso. Nosotros nos encargamos del resto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="cta-tension gap-2 text-base px-8">
                <Link to="/#precios">
                  Descubre nuestros packs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <a href="mailto:info@bebloo.es">
                  <Mail className="h-4 w-4" />
                  Contáctanos
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AboutUs;

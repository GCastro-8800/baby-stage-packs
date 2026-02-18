import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Sparkles,
  Truck,
  Shield,
  ArrowRight,
  Mail,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import heroImg from "@/assets/hero-family-stroller.jpg";
import missionImg from "@/assets/mission-family.jpg";
import carrierImg from "@/assets/mother-carrier.png";
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
          el.classList.remove("opacity-0", "translate-y-6");
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
    <div ref={ref} className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
};

/* ── zigzag section helper ────────────────────────────────── */

interface ZigzagProps {
  image: string;
  imageAlt: string;
  imageFirst?: boolean;
  children: React.ReactNode;
  bg?: string;
}

const ZigzagSection = ({ image, imageAlt, imageFirst = false, children, bg }: ZigzagProps) => (
  <section className="py-16 md:py-24 px-4" style={bg ? { background: bg } : undefined}>
    <div className="container max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Image */}
        <Reveal className={imageFirst ? "lg:order-1" : "lg:order-2"}>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
            <img src={image} alt={imageAlt} className="w-full h-full object-cover object-top" />
          </div>
        </Reveal>
        {/* Text */}
        <Reveal className={imageFirst ? "lg:order-2" : "lg:order-1"}>
          {children}
        </Reveal>
      </div>
    </div>
  </section>
);

/* ── section title helper ─────────────────────────────────── */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground leading-tight">{children}</h2>
    <div className="h-1 w-12 bg-accent rounded-full mt-4" />
  </div>
);

/* ── data ─────────────────────────────────────────────────── */

const principles = [
  { icon: CheckCircle, title: "Cero Decisiones", description: "Seleccionamos por ti. Marcas premium validadas tras cientos de restauraciones." },
  { icon: Sparkles, title: "Higiene sin Compromiso", description: "Protocolos de limpieza grado hospitalario con tecnología UV-C. Cada producto llega impecable." },
  { icon: Truck, title: "Logística Invisible", description: "Entregamos, recogemos, rotamos. Sin cajas en tu portal, sin citas imposibles." },
  { icon: Shield, title: "Confianza Total", description: "Cobertura completa ante daños accidentales. Sin letra pequeña, sin sorpresas." },
];

const stats = [
  { value: "+400", label: "carritos restaurados" },
  { value: "+4", label: "años de experiencia" },
  { value: "100s", label: "de familias atendidas" },
];

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

      {/* ─── 1. Hero ─────────────────────────────────────── */}
      <ZigzagSection image={heroImg} imageAlt="Madre con carrito de bebé" bg="hsl(var(--section-warm))">
        <div className="pt-24 md:pt-32">
          <Badge variant="secondary" className="mb-5 text-sm font-medium px-4 py-1.5">
            Nuestra misión
          </Badge>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight mb-6">
            4 años restaurando carritos nos enseñaron lo que los padres realmente necesitan
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Hemos acompañado a cientos de familias comprando, vendiendo, arrepintiéndose y volviendo a comprar. Bebloo existe para romper ese ciclo.
          </p>
        </div>
      </ZigzagSection>

      {/* ─── 2. Somos Bebloo ─────────────────────────────── */}
      <ZigzagSection image={missionImg} imageAlt="Familia disfrutando juntos" imageFirst>
        <SectionTitle>Somos Bebloo</SectionTitle>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Paola lleva desde niña fascinada con el mundo de los bebés. Esa pasión la llevó hace más de 4 años a dedicarse a restaurar y vender carritos de bebé.
          </p>
          <p>
            Cientos de transacciones después, el patrón era innegable: padres que compraban con ilusión, usaban el producto 3-4 meses, vendían con prisa… y meses después volvían a buscar lo mismo.
          </p>
          <blockquote className="border-l-4 border-accent pl-5 py-2 my-2">
            <p className="text-lg font-serif font-medium text-foreground italic">
              "Un ciclo absurdo, costoso y agotador."
            </p>
          </blockquote>
          <p>
            Gabriel, su pareja, llevaba dos años ayudándola con las restauraciones. Juntos transformaron esa experiencia en Bebloo: un servicio diseñado para que ningún padre tenga que pasar por ese ciclo otra vez.
          </p>
        </div>
      </ZigzagSection>

      {/* ─── 3. La Idea ──────────────────────────────────── */}
      <ZigzagSection image={carrierImg} imageAlt="Madre con portabebés" bg="hsl(var(--section-warm))">
        <SectionTitle>Lo que descubrimos</SectionTitle>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            La mayor parte de los padres que adquieren su equipo lo vuelven a vender después de algunos meses. Compra apresurada, uso corto, venta con pérdida.
          </p>
          <p>
            El problema no es el producto. Es el sistema de compra-acumulación-reventa. Nosotros lo sustituimos por un modelo circular: tú usas, nosotros rotamos.
          </p>
          <p>
            No venimos del mundo startup ni de consultorías. Venimos de Wallapop, de limpiar carritos a mano, de responder mensajes a las 11 de la noche. Conocemos el mercado desde las trincheras.
          </p>
          <p className="text-lg font-serif font-semibold text-foreground">
            Esa experiencia es nuestra ventaja.
          </p>
        </div>
      </ZigzagSection>

      {/* ─── 4. Nuestra Visión ───────────────────────────── */}
      <ZigzagSection image={twinsImg} imageAlt="Gemelos felices" imageFirst>
        <SectionTitle>Nuestra visión</SectionTitle>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Creemos que ser padre primerizo no debería venir con una lista interminable de decisiones de compra. Queremos que cada familia reciba exactamente lo que necesita, cuando lo necesita.
          </p>
          <p>
            Seleccionamos marcas premium validadas tras cientos de restauraciones. Aplicamos protocolos de higiene de grado hospitalario. Nos encargamos de toda la logística para que tú solo disfrutes.
          </p>
          <p>
            Empezamos en Madrid por una razón: control absoluto de la experiencia. Conocemos cada producto que sale de nuestro almacén.
          </p>
        </div>
      </ZigzagSection>

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

      {/* ─── 6. Principios ───────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-6xl">
          <Reveal>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground text-center mb-4">Nuestros principios</h2>
            <div className="h-1 w-12 bg-accent rounded-full mx-auto mb-12" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, i) => (
              <Reveal key={i}>
                <Card className="group h-full border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent/25">
                      <p.icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CTA Final ────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4" style={{ background: "hsl(var(--section-warm))" }}>
        <div className="container max-w-3xl text-center">
          <Reveal>
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-7 w-7 text-accent" />
            </div>
            <h2 className="font-serif text-2xl md:text-4xl font-semibold text-foreground mb-4">
              Nuestro compromiso con Madrid
            </h2>
            <div className="h-1 w-12 bg-accent rounded-full mx-auto mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              <p>
                Empezamos hiperlocal por una razón: control absoluto de la experiencia. Conocemos cada producto que sale de nuestro almacén. Controlamos cada limpieza. Gestionamos cada entrega personalmente.
              </p>
              <p>
                No somos una plataforma. Somos un equipo dedicado exclusivamente a que tu primer año como padre sea más simple.
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

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Truck,
  Shield,
  MapPin,
  ArrowRight,
  Mail,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-6");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
};

const RevealSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  );
};

const discoveries = [
  {
    icon: RefreshCw,
    number: "01",
    text: "30-40% de los padres que venden su equipamiento terminan recomprándolo meses después",
  },
  {
    icon: TrendingDown,
    number: "02",
    text: "Cientos de carritos restaurados nos mostraron el mismo patrón: compra apresurada, uso corto, venta con pérdida",
  },
  {
    icon: AlertTriangle,
    number: "03",
    text: "El problema no es el producto. Es el sistema de compra-acumulación-reventa",
  },
];

const principles = [
  {
    icon: CheckCircle,
    index: "01",
    title: "Cero Decisiones",
    description:
      "Seleccionamos por ti. Marcas premium validadas tras cientos de restauraciones. Sabemos qué funciona.",
  },
  {
    icon: Sparkles,
    index: "02",
    title: "Higiene sin Compromiso",
    description:
      "Protocolos de limpieza grado hospitalario con tecnología UV-C. Cada producto llega impecable, revisado y certificado.",
  },
  {
    icon: Truck,
    index: "03",
    title: "Logística Invisible",
    description:
      "Entregamos, recogemos, rotamos. Sin cajas en tu portal, sin citas imposibles. Nosotros nos adaptamos a tu vida.",
  },
  {
    icon: Shield,
    index: "04",
    title: "Confianza Total",
    description:
      "Cobertura completa ante daños accidentales. Sin letra pequeña, sin sorpresas. Tu tranquilidad es nuestra responsabilidad.",
  },
];

const team = [
  {
    name: "Paola Martín",
    role: "Cofundadora",
    description:
      "+4 años restaurando y vendiendo equipamiento de bebé. Conoce cada modelo, cada marca, cada detalle que importa.",
    quote: "Cada carrito que pasa por mis manos me enseña algo nuevo sobre lo que los padres realmente necesitan.",
  },
  {
    name: "Gabriel",
    role: "Cofundador",
    description:
      "2 años en operaciones y ventas de equipamiento infantil. Obsesionado con que todo funcione sin fricción.",
    quote: "Si un padre tiene que pensar en la logística, es que algo hemos hecho mal.",
  },
];

const stats = [
  { value: "+400", label: "carritos restaurados" },
  { value: "+4", label: "años de experiencia" },
  { value: "100s", label: "de familias atendidas" },
];

const AboutUs = () => {
  useEffect(() => {
    document.title =
      "Quiénes Somos | Bebloo - Equipamiento Premium por Suscripción para Bebés en Madrid";
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

      {/* 1. Hero */}
      <section className="hero-section pt-32 pb-14 md:pt-40 md:pb-20 px-4">
        <div className="container max-w-4xl text-center">
          <RevealSection>
            <Badge variant="secondary" className="mb-6 text-sm font-medium px-4 py-1.5">
              Nuestra historia
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight mb-6">
              4 años restaurando carritos nos enseñaron lo que los padres realmente necesitan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              No somos padres todavía. Pero hemos visto de cerca cientos de familias comprando,
              vendiendo, arrepintiéndose y volviendo a comprar. Bebloo existe para romper ese ciclo.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-accent/40" />
              <div className="w-2 h-2 rounded-full bg-accent/60" />
              <div className="h-px w-12 bg-accent/40" />
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 2. Lo Que Descubrimos */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-6xl">
          <RevealSection>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
              Lo que descubrimos
            </h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discoveries.map((item, i) => (
              <RevealSection key={i}>
                <div className="relative h-full rounded-lg border-l-4 border-accent bg-card p-6 shadow-sm">
                  <span className="absolute top-4 right-4 text-4xl font-serif font-semibold text-accent/15 leading-none">
                    {item.number}
                  </span>
                  <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-base">{item.text}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Nuestra Historia */}
      <section className="py-16 md:py-24 px-4" style={{ background: "hsl(var(--section-warm))" }}>
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
            <RevealSection className="md:col-span-3 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
                Nuestra historia
              </h2>
              <div className="space-y-5 text-foreground/80 leading-relaxed">
                <p className="text-lg font-medium text-foreground">
                  Bebloo nació de una obsesión.
                </p>
                <p>
                  Paola lleva desde niña fascinada con el mundo de los bebés. Su sueño siempre ha
                  sido ser madre, y esa pasión la llevó hace más de 4 años a dedicarse a restaurar y
                  vender carritos de bebé en Wallapop y Vinted.
                </p>
                <p>
                  Cientos de transacciones después, el patrón era innegable: padres que compraban
                  con ilusión, usaban el producto 3-4 meses, vendían con prisa... y meses después
                  volvían a buscar lo mismo porque lo necesitaban de nuevo.
                </p>

                {/* Pull-quote */}
                <blockquote className="border-l-4 border-accent pl-5 py-3 my-6">
                  <p className="text-lg md:text-xl font-serif font-medium text-foreground italic">
                    "Un ciclo absurdo, costoso y agotador."
                  </p>
                </blockquote>

                <p>
                  Cuando su hermano tuvo una hija, Paola vivió de cerca toda la logística del primer
                  año desde dentro de una familia. Ahí se consolidó la idea.
                </p>
                <p>
                  Gabriel, su pareja, llevaba dos años ayudándola con las restauraciones y ventas.
                  Juntos transformaron esa experiencia de mercado en Bebloo: un servicio diseñado
                  para que ningún padre tenga que pasar por ese ciclo otra vez.
                </p>
              </div>
            </RevealSection>
            <RevealSection className="md:col-span-2 flex items-center justify-center">
              <div className="w-full max-w-xs rounded-2xl bg-card border border-border/50 shadow-sm p-8 space-y-6">
                {stats.map((stat, i) => (
                  <div key={i} className={`text-center ${i < stats.length - 1 ? "pb-6 border-b border-border/30" : ""}`}>
                    <span className="text-4xl md:text-5xl font-semibold text-accent font-serif">
                      {stat.value}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 4. Por Qué Somos Diferentes */}
      <section className="py-16 md:py-24 px-4" style={{ background: "hsl(var(--step-bg))" }}>
        <div className="container max-w-4xl">
          <RevealSection>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-8">
              Por qué somos diferentes
            </h2>
            <div className="space-y-5 text-foreground/80 leading-relaxed text-center">
              <p>
                No venimos del mundo startup ni de consultorías de innovación. Venimos de Wallapop,
                de limpiar carritos a mano, de responder mensajes a las 11 de la noche preguntando
                si el Bugaboo tiene algún arañazo.
              </p>
              <p>
                Conocemos el mercado de equipamiento infantil desde las trincheras. Sabemos qué
                productos duran, cuáles decepcionan, qué buscan realmente los padres y qué terminan
                vendiendo al mes.
              </p>
            </div>

            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-3 my-8">
              <div className="h-px w-16 bg-accent/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              <div className="h-px w-16 bg-accent/30" />
            </div>

            <p className="text-2xl md:text-3xl font-serif font-semibold text-foreground text-center leading-snug">
              Esa experiencia es nuestra ventaja.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* 5. Nuestros Principios */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-6xl">
          <RevealSection>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
              Nuestros principios
            </h2>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, i) => (
              <RevealSection key={i}>
                <Card className="group h-full border-border/50 bg-card transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center transition-colors duration-300 group-hover:bg-accent/25">
                        <p.icon className="h-7 w-7 text-accent" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground/40 mt-1">
                        {p.index}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {p.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 6. El Equipo */}
      <section className="py-16 md:py-24 px-4" style={{ background: "hsl(var(--section-warm))" }}>
        <div className="container max-w-4xl">
          <RevealSection>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
              El equipo
            </h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, i) => (
              <RevealSection key={i}>
                <Card className="border-border/50 bg-card">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center mb-2">
                      <span className="text-2xl font-semibold text-accent font-serif">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-xl">{member.name}</h3>
                      <p className="text-sm text-accent font-medium">{member.role}</p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                    <div className="pt-3 border-t border-border/30">
                      <div className="flex gap-2 items-start">
                        <Quote className="h-4 w-4 text-accent/40 mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground/70 italic leading-relaxed">
                          {member.quote}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 7+8. Compromiso con Madrid + CTA Final (fusionados) */}
      <section
        className="py-16 md:py-24 px-4"
        style={{ background: "hsl(var(--section-warm))" }}
      >
        <div className="container max-w-3xl text-center">
          <RevealSection>
            <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-7 w-7 text-accent" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Nuestro compromiso con Madrid
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed max-w-2xl mx-auto mb-10">
              <p>
                Empezamos hiperlocal por una razón: control absoluto de la experiencia. Conocemos
                cada producto que sale de nuestro almacén. Controlamos cada limpieza. Gestionamos
                cada entrega personalmente.
              </p>
              <p>
                No somos una plataforma. Somos un equipo dedicado exclusivamente a que tu primer
                año como padre sea más simple.
              </p>
            </div>

            {/* Decorative separator */}
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-16 bg-accent/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              <div className="h-px w-16 bg-accent/30" />
            </div>

            <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-4">
              ¿Listo para dejar de decidir?
            </h2>
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
          </RevealSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;

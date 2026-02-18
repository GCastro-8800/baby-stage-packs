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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    text: "30-40% de los padres que venden su equipamiento terminan recomprándolo meses después",
  },
  {
    icon: TrendingDown,
    text: "Cientos de carritos restaurados nos mostraron el mismo patrón: compra apresurada, uso corto, venta con pérdida",
  },
  {
    icon: AlertTriangle,
    text: "El problema no es el producto. Es el sistema de compra-acumulación-reventa",
  },
];

const principles = [
  {
    icon: CheckCircle,
    title: "Cero Decisiones",
    description:
      "Seleccionamos por ti. Marcas premium validadas tras cientos de restauraciones. Sabemos qué funciona.",
  },
  {
    icon: Sparkles,
    title: "Higiene sin Compromiso",
    description:
      "Protocolos de limpieza grado hospitalario con tecnología UV-C. Cada producto llega impecable, revisado y certificado.",
  },
  {
    icon: Truck,
    title: "Logística Invisible",
    description:
      "Entregamos, recogemos, rotamos. Sin cajas en tu portal, sin citas imposibles. Nosotros nos adaptamos a tu vida.",
  },
  {
    icon: Shield,
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
  },
  {
    name: "Gabriel",
    role: "Cofundador",
    description:
      "2 años en operaciones y ventas de equipamiento infantil. Obsesionado con que todo funcione sin fricción.",
  },
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
      <section className="hero-section pt-32 pb-20 md:pt-40 md:pb-28 px-4">
        <div className="container max-w-4xl text-center">
          <RevealSection>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-tight mb-6">
              4 años restaurando carritos nos enseñaron lo que los padres realmente necesitan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No somos padres todavía. Pero hemos visto de cerca cientos de familias comprando,
              vendiendo, arrepintiéndose y volviendo a comprar. Bebloo existe para romper ese ciclo.
            </p>
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
                <Card className="h-full border-border/50 bg-card">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <p className="text-foreground/90 leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
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
                  volvían a buscar lo mismo porque lo necesitaban de nuevo. Un ciclo absurdo, costoso
                  y agotador.
                </p>
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
              <div className="w-full aspect-square max-w-xs rounded-2xl bg-primary/10 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <span className="text-5xl md:text-6xl font-semibold text-primary-foreground/70 font-serif">
                    +400
                  </span>
                  <p className="text-sm text-muted-foreground">carritos restaurados</p>
                </div>
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
            <div className="space-y-5 text-foreground/80 leading-relaxed text-center md:text-left">
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
              <p className="text-lg font-medium text-foreground">
                Esa experiencia es nuestra ventaja.
              </p>
            </div>
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
                <Card className="h-full border-border/50 bg-card">
                  <CardContent className="p-6 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                      <p.icon className="h-5 w-5 text-accent" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <RevealSection key={i}>
                <Card className="border-border/50 bg-card">
                  <CardContent className="p-6 space-y-2">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                      <span className="text-xl font-semibold text-primary-foreground/70 font-serif">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                    <p className="text-sm text-accent font-medium">{member.role}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Compromiso con Madrid */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-4xl">
          <RevealSection>
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
                <MapPin className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                Nuestro compromiso con Madrid
              </h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed max-w-2xl">
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
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 8. CTA Final */}
      <section
        className="py-16 md:py-24 px-4"
        style={{ background: "hsl(var(--step-bg))" }}
      >
        <div className="container max-w-3xl text-center">
          <RevealSection>
            <h2 className="text-2xl md:text-4xl font-semibold text-foreground mb-8">
              ¿Listo para dejar de decidir?
            </h2>
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

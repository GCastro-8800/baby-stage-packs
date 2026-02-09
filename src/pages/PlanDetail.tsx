import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, CalendarDays, Mail, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPlanById, type PlanData, type EquipmentCategory } from "@/data/planEquipment";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";

const WHATSAPP_NUMBER = "34638706467";
const CALENDLY_URL = "https://calendly.com/martincabanaspaola/30min";

const EquipmentCard = ({ category }: { category: EquipmentCategory }) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <h4 className="font-semibold text-foreground mb-3">{category.category}</h4>
    <ul className="space-y-1.5">
      {category.options.map((opt, i) => (
        <li key={i} className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{opt.brand}</span>{" "}
          {opt.model}
        </li>
      ))}
    </ul>
  </div>
);

const PlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { track } = useAnalytics();

  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plan = getPlanById(planId || "");

  useEffect(() => {
    if (plan) {
      track("plan_detail_view" as any, { plan: plan.name });
    }
  }, [plan, track]);

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Plan no encontrado</h1>
          <Button variant="outline" onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa el plan ${plan.name}. ¿Podrías darme más información?`)}`;

  const handleContactClick = (type: "whatsapp" | "calendly") => {
    track("contact_click" as any, { type, plan: plan.name });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("leads")
      .insert({ email, plan: plan.name, postal_code: postalCode || null });

    if (error) {
      setIsLoading(false);
      if (error.code === "23505") {
        toast({
          title: "Ya te habías registrado",
          description: "Este email ya está en nuestra lista. Te avisaremos pronto.",
        });
        setIsSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "No pudimos guardar tu email. Inténtalo de nuevo.",
        });
      }
      return;
    }

    try {
      await supabase.functions.invoke("send-confirmation-email", {
        body: { email, plan: plan.name, postalCode: postalCode || undefined },
      });
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    track("lead_captured", { plan: plan.name, has_postal_code: !!postalCode });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-30">
        <div className="container max-w-5xl flex items-center gap-3 py-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/#precios")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-serif font-semibold text-foreground">{plan.name}</span>
        </div>
      </div>

      <div className="container max-w-5xl px-4 py-10 md:py-16 space-y-12">
        {/* Plan header */}
        <section className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif text-foreground mb-3">{plan.name}</h1>
          <p className="text-muted-foreground text-base md:text-lg mb-4">{plan.description}</p>
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-4xl md:text-5xl font-serif font-bold text-foreground">€{plan.price}</span>
            <span className="text-muted-foreground">/mes</span>
          </div>
          <p className="text-sm text-muted-foreground">{plan.duration}</p>
          <div className="flex items-start justify-center gap-2 mt-4 text-sm text-muted-foreground max-w-md mx-auto">
            <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span>{plan.guarantee}</span>
          </div>
        </section>

        {/* Equipment grid */}
        <section>
          <h2 className="text-xl md:text-2xl font-serif text-foreground mb-2 text-center">
            Tu equipamiento
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Estas son algunas de las marcas disponibles. El equipo de Bebloo te ayudará a elegir la mejor opción para ti.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plan.equipment.map((cat, i) => (
              <EquipmentCard key={i} category={cat} />
            ))}
          </div>
        </section>

        {/* Contact / next steps */}
        <section>
          <h2 className="text-xl md:text-2xl font-serif text-foreground mb-2 text-center">
            ¿Cómo quieres continuar?
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-md mx-auto">
            Habla con nosotros antes de decidir. Sin compromiso.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleContactClick("whatsapp")}
              className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)]/10 flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-[hsl(142,70%,45%)]" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Habla por WhatsApp</h3>
              <p className="text-sm text-muted-foreground">
                Respuesta rápida. Resolvemos tus dudas al momento.
              </p>
            </a>

            {/* Calendly */}
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleContactClick("calendly")}
              className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border hover:border-primary/40 bg-card transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Reserva una llamada</h3>
              <p className="text-sm text-muted-foreground">
                30 min para explicarte todo con calma. Elige tu horario.
              </p>
            </a>

            {/* Email */}
            <div className="flex flex-col items-center text-center p-6 rounded-xl border-2 border-border bg-card">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Déjanos tu email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Te avisamos cuando lleguemos a tu zona.
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 text-sm"
                  />
                  <Input
                    type="text"
                    placeholder="Código postal (opcional)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={5}
                    inputMode="numeric"
                    className="h-11 text-sm"
                  />
                  <Button type="submit" className="w-full cta-tension" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Avísame"}
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <p className="text-sm text-foreground font-medium">¡Listo! Te avisaremos.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlanDetail;

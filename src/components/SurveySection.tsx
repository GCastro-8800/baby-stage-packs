import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, MessageCircleHeart } from "lucide-react";

const FORM_URL = "https://forms.gle/hmHKqXDSDLL1Djza8";
// QR Code generated via API - more reliable than qrcode.react
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(FORM_URL)}`;

const SurveySection = () => {
  const isMobile = useIsMobile();

  const handleOpenForm = () => {
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <MessageCircleHeart className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            ¿Nos ayudas a mejorar?
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Estamos diseñando bebloo contigo. Cuéntanos qué necesitas en 2 minutos.
          </p>

          {/* Content card */}
          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-sm border border-border">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              {/* QR Code - Desktop only */}
              {!isMobile && (
                <div className="flex-shrink-0">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <img 
                      src={QR_CODE_URL} 
                      alt="QR Code para acceder al formulario"
                      width={150}
                      height={150}
                      className="block"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Escanea con tu móvil
                  </p>
                </div>
              )}

              {/* Benefits list */}
              <div className="flex-1 text-left">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-primary-foreground">✓</span>
                    </span>
                    <span className="text-foreground">Solo 5 preguntas rápidas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-primary-foreground">✓</span>
                    </span>
                    <span className="text-foreground">Tu opinión da forma al servicio</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm font-medium text-primary-foreground">✓</span>
                    </span>
                    <span className="text-foreground">Sin spam, lo prometemos</span>
                  </li>
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={handleOpenForm}
                  className="mt-8 w-full md:w-auto cta-tension rounded-full px-8 py-6 text-base font-medium"
                >
                  Responder ahora
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveySection;

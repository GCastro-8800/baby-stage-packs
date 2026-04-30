import { ShieldCheck, RefreshCw, MessageCircle } from "lucide-react";

interface TrustBadgesProps {
  whatsappUrl?: string;
  className?: string;
}

export default function TrustBadges({
  whatsappUrl = "https://wa.me/34600000000",
  className = "",
}: TrustBadgesProps) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-primary-foreground shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">Devolución gratis</strong> los primeros 14 días si algo no encaja.
        </span>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <RefreshCw className="h-4 w-4 text-primary-foreground shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">Cambia el material</strong> cuando quieras durante tu servicio.
        </span>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <MessageCircle className="h-4 w-4 text-primary-foreground shrink-0 mt-0.5" />
        <span>
          <strong className="text-foreground">Atención personal</strong> por WhatsApp si tienes dudas.
        </span>
      </a>
    </div>
  );
}

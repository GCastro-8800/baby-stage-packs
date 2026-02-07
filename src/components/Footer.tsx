import { Instagram, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-bebloo.png";

const Footer = () => {
  return (
    <footer className="py-12 px-4 md:py-16 md:px-6 bg-foreground">
      <div className="container max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={logo} alt="bebloo" className="h-10 mb-4 brightness-0 invert" />
            <p className="text-background/70 text-sm leading-relaxed max-w-xs">
              Suscripción de equipamiento premium para bebés. Menos cajas, más calma.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Servicio</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#pricing" className="text-background/70 hover:text-background transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#faq" className="text-background/70 hover:text-background transition-colors">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-background/70 hover:text-background transition-colors">
                  Cómo funciona
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="mailto:hola@bebloo.es" 
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  hola@bebloo.es
                </a>
              </li>
              <li>
                <a 
                  href="tel:+34600000000" 
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +34 600 000 000
                </a>
              </li>
              <li>
                <a 
                  href="https://instagram.com/bebloo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  @bebloo
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
            <p>© 2026 bebloo. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link to="/condiciones" className="hover:text-background/70 transition-colors">Términos y condiciones</Link>
              <Link to="/privacidad" className="hover:text-background/70 transition-colors">Política de privacidad</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

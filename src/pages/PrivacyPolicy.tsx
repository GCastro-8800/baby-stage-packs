import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-bebloo.png";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 md:p-6 border-b border-border">
        <div className="container max-w-4xl flex items-center justify-between">
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <Link to="/">
            <img src={logo} alt="bebloo" className="h-8" />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl py-12 px-4 md:py-16 md:px-6">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-foreground mb-2">
          Política de Privacidad
        </h1>
        <p className="text-muted-foreground mb-10">Última actualización: 7 de febrero de 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Responsable del tratamiento</h2>
            <p className="leading-relaxed">
              El responsable del tratamiento de tus datos personales es <strong>bebloo</strong>, con domicilio social en España. 
              Puedes contactarnos en cualquier momento a través de{" "}
              <a href="mailto:hola@bebloo.es" className="text-primary hover:underline">hola@bebloo.es</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Datos que recopilamos</h2>
            <p className="leading-relaxed mb-3">Recopilamos los siguientes datos personales cuando utilizas nuestro servicio:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Datos de registro:</strong> nombre completo, dirección de correo electrónico y contraseña.</li>
              <li><strong>Datos del bebé:</strong> fecha de nacimiento o fecha estimada de parto, y si es tu primer hijo/a.</li>
              <li><strong>Datos de uso:</strong> interacciones con la aplicación, preferencias y configuración del servicio.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, dispositivo y sistema operativo.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Finalidad del tratamiento</h2>
            <p className="leading-relaxed mb-3">Utilizamos tus datos para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestionar tu cuenta y autenticación.</li>
              <li>Personalizar la experiencia según la etapa de tu bebé.</li>
              <li>Preparar y enviar los packs de suscripción adecuados.</li>
              <li>Comunicarnos contigo sobre tu suscripción y servicio.</li>
              <li>Mejorar y optimizar nuestro servicio.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Base legal del tratamiento</h2>
            <p className="leading-relaxed">
              El tratamiento de tus datos se basa en: (a) la ejecución del contrato de suscripción, 
              (b) tu consentimiento expreso al registrarte, y (c) nuestro interés legítimo en mejorar el servicio. 
              Puedes retirar tu consentimiento en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Protección y almacenamiento</h2>
            <p className="leading-relaxed">
              Tus datos se almacenan en servidores seguros con cifrado en tránsito y en reposo. 
              Implementamos medidas técnicas y organizativas adecuadas para proteger tus datos contra 
              acceso no autorizado, pérdida o alteración. Solo el personal autorizado tiene acceso a los datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Conservación de datos</h2>
            <p className="leading-relaxed">
              Conservaremos tus datos mientras mantengas tu cuenta activa o mientras sea necesario para 
              prestarte el servicio. Una vez que solicites la eliminación de tu cuenta, procederemos a 
              eliminar tus datos en un plazo máximo de 30 días, salvo obligación legal de conservación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Tus derechos (RGPD)</h2>
            <p className="leading-relaxed mb-3">
              De acuerdo con el Reglamento General de Protección de Datos (RGPD), tienes derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Acceso:</strong> conocer qué datos personales tratamos sobre ti.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong>Supresión:</strong> solicitar la eliminación de tus datos.</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en un formato estructurado.</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en ciertos supuestos.</li>
              <li><strong>Limitación:</strong> solicitar la restricción del tratamiento.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Para ejercer cualquiera de estos derechos, escríbenos a{" "}
              <a href="mailto:hola@bebloo.es" className="text-primary hover:underline">hola@bebloo.es</a>. 
              Responderemos en un plazo máximo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies</h2>
            <p className="leading-relaxed">
              Utilizamos cookies estrictamente necesarias para el funcionamiento de la aplicación, 
              como las de autenticación y preferencias de sesión. No utilizamos cookies de seguimiento 
              publicitario de terceros. Puedes configurar tu navegador para rechazar cookies, aunque 
              esto podría afectar al funcionamiento del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Terceros y transferencias</h2>
            <p className="leading-relaxed">
              No vendemos ni compartimos tus datos personales con terceros con fines comerciales. 
              Podemos compartir datos con proveedores de servicios que nos ayudan a operar la plataforma, 
              siempre bajo acuerdos de confidencialidad y protección de datos adecuados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Cambios en esta política</h2>
            <p className="leading-relaxed">
              Nos reservamos el derecho de actualizar esta política de privacidad. Te notificaremos 
              cualquier cambio significativo por correo electrónico o mediante un aviso en la aplicación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contacto</h2>
            <p className="leading-relaxed">
              Si tienes preguntas sobre esta política o sobre el tratamiento de tus datos, contáctanos en:{" "}
              <a href="mailto:hola@bebloo.es" className="text-primary hover:underline">hola@bebloo.es</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

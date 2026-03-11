import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-bebloo.png";

export default function TermsOfService() {
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
          Términos y Condiciones
        </h1>
        <p className="text-muted-foreground mb-10">Última actualización: 11 de marzo de 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Descripción del servicio</h2>
            <p className="leading-relaxed">
              <strong>bebloo</strong> es un servicio de equipamiento premium para bebés. El usuario selecciona 
              productos individuales de nuestro catálogo, elige la duración deseada para cada uno, y bebloo se encarga 
              de la entrega a domicilio, la limpieza profesional y la recogida al finalizar el periodo contratado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Registro y cuenta</h2>
            <p className="leading-relaxed mb-3">Para utilizar el servicio debes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ser mayor de 18 años o contar con autorización de un tutor legal.</li>
              <li>Proporcionar información veraz y actualizada durante el registro.</li>
              <li>Mantener la confidencialidad de tus credenciales de acceso.</li>
              <li>Notificarnos inmediatamente cualquier uso no autorizado de tu cuenta.</li>
            </ul>
            <p className="leading-relaxed mt-3">
              Eres responsable de toda actividad que ocurra bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Selección y precios</h2>
            <p className="leading-relaxed">
              bebloo ofrece un catálogo de productos individuales. El usuario selecciona los productos que necesita 
              y elige la duración para cada uno (3, 6, 9 o 12 meses). El precio mensual total es la suma de los 
              precios individuales de los productos seleccionados. Los precios se muestran en euros (€) e incluyen IVA. 
              A mayor duración, mayor ahorro por producto. Nos reservamos el derecho de modificar los precios con un 
              preaviso mínimo de 30 días.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Pagos y facturación</h2>
            <p className="leading-relaxed">
              Los pagos se procesan de forma mensual. El cargo se realizará automáticamente en el método de pago 
              registrado. En caso de fallo en el cobro, intentaremos procesarlo nuevamente. Si el pago no se completa 
              tras varios intentos, podremos suspender temporalmente el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Envíos y entregas</h2>
            <p className="leading-relaxed">
              Los productos se entregan a la dirección proporcionada en tu perfil. Actualmente operamos en Madrid y 
              su área metropolitana. Los plazos de entrega son estimados y pueden variar según la disponibilidad. 
              bebloo no se hace responsable de retrasos causados por datos de envío incorrectos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Cuidado del equipamiento</h2>
            <p className="leading-relaxed">
              El usuario se compromete a cuidar razonablemente los productos durante el periodo de uso. 
              El desgaste normal por uso está cubierto. En caso de daños graves por negligencia o uso indebido, 
              bebloo podrá solicitar una compensación proporcional al daño.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Cancelación y devoluciones</h2>
            <p className="leading-relaxed mb-3">
              No hay permanencia obligatoria. Puedes solicitar la devolución de cualquier producto en cualquier momento. 
              Al cancelar:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Coordinaremos la recogida del equipamiento a domicilio sin coste adicional.</li>
              <li>No se realizarán cargos adicionales tras la devolución.</li>
              <li>Los días de uso del mes en curso serán facturados proporcionalmente.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Uso aceptable</h2>
            <p className="leading-relaxed mb-3">Te comprometes a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar el servicio únicamente para fines personales y no comerciales.</li>
              <li>No intentar acceder a áreas restringidas del sistema.</li>
              <li>No reproducir, duplicar o explotar comercialmente el contenido de la plataforma.</li>
              <li>No utilizar el servicio de forma que pueda dañar, sobrecargar o perjudicar su funcionamiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Propiedad intelectual</h2>
            <p className="leading-relaxed">
              Todo el contenido de la plataforma (textos, imágenes, logotipos, diseños, software) es propiedad 
              de bebloo o de sus licenciantes y está protegido por las leyes de propiedad intelectual. 
              No se concede ningún derecho de reproducción o distribución sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitación de responsabilidad</h2>
            <p className="leading-relaxed">
              bebloo proporciona el servicio "tal cual" y no garantiza que sea ininterrumpido o libre de errores. 
              En la máxima medida permitida por la ley, bebloo no será responsable de daños indirectos, 
              incidentales o consecuentes derivados del uso del servicio. Nuestra responsabilidad total 
              se limitará al importe pagado por el usuario en los últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Modificaciones</h2>
            <p className="leading-relaxed">
              Podemos modificar estos términos en cualquier momento. Te notificaremos los cambios 
              significativos por correo electrónico o mediante un aviso en la aplicación con al menos 
              15 días de antelación. El uso continuado del servicio tras la notificación constituye 
              la aceptación de los nuevos términos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Ley aplicable y jurisdicción</h2>
            <p className="leading-relaxed">
              Estos términos se rigen por la legislación española. Para la resolución de cualquier 
              controversia, las partes se someten a los juzgados y tribunales de la ciudad de Madrid, España, 
              sin perjuicio del fuero que corresponda al consumidor conforme a la normativa vigente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Contacto</h2>
            <p className="leading-relaxed">
              Para cualquier consulta sobre estos términos, puedes escribirnos a{" "}
              <a href="mailto:info@bebloo.es" className="text-primary hover:underline">info@bebloo.es</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

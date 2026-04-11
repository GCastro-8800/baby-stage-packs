

## Plan: Migrar de Lovable Emails a Resend

### Resumen
Desactivar el sistema de emails integrado (que requiere delegación NS incompatible con Hostinger) y reemplazarlo con Resend, que solo necesita registros TXT/CNAME que Hostinger sí soporta.

### Pasos

**1. Desactivar Lovable Emails y conectar Resend**
- Desactivar los emails integrados del proyecto
- Conectar el conector de Resend (te pedirá crear una cuenta en resend.com si no la tienes y vincular tu API key)
- Una vez conectado, verificar tu dominio `bebloo.es` en Resend (solo necesitas añadir registros TXT y CNAME en Hostinger — esto sí lo soporta)

**2. Reescribir `send-confirmation-email` para usar Resend vía gateway**
- Eliminar la dependencia directa de Resend npm y usar el connector gateway en su lugar
- Mantener la misma lógica de validación, rate limiting y verificación de lead
- Mantener el mismo HTML del email

**3. Reescribir `auth-email-hook` para usar Resend vía gateway**
- Cambiar el envío de emails de autenticación (signup, recovery, magic-link, etc.) para que use Resend a través del gateway en lugar del sistema de colas integrado
- Mantener las mismas plantillas React Email con el branding bebloo
- Envío directo vía Resend en lugar de encolar en pgmq

**4. Reescribir `send-transactional-email` para usar Resend vía gateway**
- Mantener la verificación de supresión y el logging en `email_send_log`
- Reemplazar el encolado pgmq por envío directo vía Resend gateway
- Mantener las plantillas React Email existentes

**5. Eliminar registros NS de notify.bebloo.es**
- Una vez todo funcione con Resend, eliminar los registros NS de `notify.bebloo.es` en Hostinger (si los llegaste a añadir)

### Lo que necesitarás hacer tú
- Crear una cuenta en [resend.com](https://resend.com) (gratis hasta 3,000 emails/mes)
- Verificar el dominio `bebloo.es` en Resend añadiendo los registros DNS que te indique (TXT y CNAME — compatibles con Hostinger)
- Vincular tu conexión de Resend cuando te lo pida el sistema

### Detalles técnicos
- Se usará el connector gateway de Resend (`connector-gateway.lovable.dev/resend`) para todos los envíos
- Las plantillas React Email existentes se mantienen intactas
- El from address será `bebloo <noreply@bebloo.es>` (o el subdominio que configures en Resend)
- Se mantiene el logging en `email_send_log` para auditoría
- Se simplifica la arquitectura eliminando las colas pgmq (Resend gestiona reintentos internamente)


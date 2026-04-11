

## Plan: Test end-to-end completo

### Sobre el panel de emails
Lo que ves ("Emails disabled") es correcto y esperado. El sistema integrado de emails de Lovable está desactivado porque migramos todo a Resend. Tus emails funcionan independientemente de ese panel. No hay que hacer nada al respecto.

### Test E2E: Registro → Onboarding → Pago → Email → Dashboard

Voy a recorrer el flujo completo usando las herramientas del navegador para verificar cada paso:

**1. Registro (Auth)**
- Navegar a `/auth`
- Verificar que el formulario de registro carga correctamente
- Verificar que "Continuar con Google" funciona
- Intentar crear cuenta con email (verificar que el email de confirmación se envía via Resend)

**2. Onboarding**
- Verificar que tras login el usuario sin onboarding completado es redirigido a `/onboarding`
- Recorrer los pasos del flujo de onboarding
- Confirmar que al completar se redirige a `/app`

**3. Pago (Stripe Checkout)**
- Desde el dashboard o packs, iniciar un checkout
- Verificar que la Edge Function `stripe-checkout` responde correctamente
- Confirmar que tras el pago se redirige a la página de éxito
- Verificar que el email de confirmación de pedido se dispara

**4. Email**
- Revisar los logs de la Edge Function `send-transactional-email` para confirmar envíos exitosos
- Revisar los logs de `auth-email-hook` para emails de auth
- Verificar entradas en `email_send_log`

**5. Dashboard**
- Confirmar que `/app` carga con los datos del usuario
- Verificar que la suscripción aparece correctamente

### Metodología
- Usaré el navegador integrado para navegar por la app
- Revisaré logs de Edge Functions para verificar el backend
- Consultaré la base de datos para confirmar registros
- Documentaré cualquier error encontrado y lo corregiré

### Nota importante
El registro con email real requiere verificación (el email debe llegar vía Resend). Para el test, puedo verificar que el flujo se ejecuta correctamente hasta donde sea posible sin crear usuarios reales, y complementar con revisión de logs y Edge Functions.


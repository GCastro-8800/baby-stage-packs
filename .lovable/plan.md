## Guardar STRIPE_WEBHOOK_SECRET (live)

Voy a abrir el modal seguro para que pegues el `whsec_...` que copiaste del endpoint live de Stripe. Una vez guardado, el webhook `stripe-webhook` validará correctamente las firmas de los eventos en producción (checkout completado → crea subscription + shipment + email de confirmación).

### Pasos

1. Abrir modal seguro `add_secret` para `STRIPE_WEBHOOK_SECRET`.
2. Tú pegas el valor `whsec_...` del endpoint live.
3. Lovable lo guarda como secret del proyecto (sobreescribe el de test).
4. El edge function `stripe-webhook` lo recoge automáticamente — sin redeploy manual.

### Después de guardar

- Hacer una compra de prueba real (1€ con tarjeta tuya) para verificar que:
  - Stripe registra el `checkout.session.completed`
  - El webhook responde 200 en el dashboard de Stripe (Developers → Webhooks → tu endpoint → "Eventos recientes")
  - Se crea la `subscription` + `shipment` en BD
  - Llega el email de confirmación
- Si todo OK, te puedes reembolsar el cobro desde Stripe.

### Rollback

Si algo falla, vuelves a guardar el `whsec_...` del endpoint de test con el mismo flujo.

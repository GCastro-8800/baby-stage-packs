import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface ServiceEndingSoonProps {
  customerName?: string
  daysLeft?: number
  endDate?: string
  renewUrl?: string
  products?: { name: string }[]
}

const ServiceEndingSoonEmail = ({
  customerName,
  daysLeft = 14,
  endDate,
  renewUrl = 'https://bebloo.es/configurador',
  products = [],
}: ServiceEndingSoonProps) => {
  const urgent = (daysLeft ?? 14) <= 1
  const headline = urgent
    ? '¡Última llamada! Tu servicio termina mañana'
    : daysLeft === 7
      ? `Tu servicio termina en una semana`
      : `Tu servicio termina en ${daysLeft} días`

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>{headline} — renueva si quieres seguir disfrutando</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>{SITE_NAME}</Text>
          </Section>

          <Heading style={h1}>
            {customerName ? `Hola ${customerName}, ` : 'Hola, '}
            {headline.toLowerCase()}
          </Heading>

          <Text style={text}>
            {endDate
              ? `El ${endDate} llega el final de tu compromiso actual con ${SITE_NAME}.`
              : `Tu compromiso actual con ${SITE_NAME} está a punto de terminar.`}
            {' '}Si quieres seguir con nosotros, puedes renovar en un par de clics.
          </Text>

          {products.length > 0 && (
            <Section style={productsBox}>
              <Text style={productsTitle}>Lo que tienes con nosotros:</Text>
              {products.map((p, i) => (
                <Text key={i} style={productItem}>• {p.name}</Text>
              ))}
            </Section>
          )}

          <Section style={ctaSection}>
            <Button href={renewUrl} style={button}>Renovar mi servicio</Button>
          </Section>

          <Hr style={divider} />

          <Text style={text}>
            Si prefieres no continuar, no tienes que hacer nada ahora.
            Cuando llegue la fecha te avisaremos para programar la recogida
            cuando mejor te venga.
          </Text>

          <Text style={closingText}>
            Con cariño,<br />
            El equipo de {SITE_NAME} 💙
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ServiceEndingSoonEmail,
  subject: (data: Record<string, any>) => {
    const d = data?.daysLeft ?? 14
    if (d <= 1) return '¡Última llamada! Tu servicio bebloo termina mañana'
    if (d === 7) return 'Tu servicio bebloo termina en una semana'
    return `Tu servicio bebloo termina en ${d} días`
  },
  displayName: 'Aviso fin de servicio',
  previewData: {
    customerName: 'María',
    daysLeft: 7,
    endDate: '15 de mayo de 2026',
    renewUrl: 'https://bebloo.es/configurador',
    products: [{ name: 'Cuna de viaje' }, { name: 'Cochecito urbano' }],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { fontSize: '28px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '0 0 16px' }
const productsBox = { backgroundColor: '#F5FAFF', borderRadius: '8px', padding: '16px 20px', margin: '20px 0' }
const productsTitle = { fontSize: '13px', fontWeight: '600' as const, color: '#2B4F6E', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const productItem = { fontSize: '14px', color: '#2B4F6E', margin: '4px 0' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = { backgroundColor: '#FF7A6B', color: '#ffffff', padding: '14px 28px', borderRadius: '999px', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none', display: 'inline-block' }
const divider = { borderColor: '#E8F0F7', margin: '24px 0' }
const closingText = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '24px 0 0' }

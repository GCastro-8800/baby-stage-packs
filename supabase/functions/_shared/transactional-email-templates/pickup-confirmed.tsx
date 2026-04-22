import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface PickupConfirmedProps {
  customerName?: string
  pickupDate?: string
  pickupWindow?: string
}

const PickupConfirmedEmail = ({
  customerName,
  pickupDate = 'el día acordado',
  pickupWindow = 'la franja elegida',
}: PickupConfirmedProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Recogida confirmada · {pickupDate} ({pickupWindow})</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>{SITE_NAME}</Text>
        </Section>

        <Heading style={h1}>
          {customerName ? `¡Listo, ${customerName}!` : '¡Listo!'} Recogida confirmada
        </Heading>

        <Section style={highlightBox}>
          <Text style={highlightLabel}>Día de recogida</Text>
          <Text style={highlightValue}>{pickupDate}</Text>
          <Text style={highlightLabel}>Franja horaria</Text>
          <Text style={highlightValue}>{pickupWindow}</Text>
        </Section>

        <Text style={text}>
          Pasaremos a recoger los productos en la dirección que tenemos
          registrada. Asegúrate de tenerlos listos en la entrada o en un
          lugar accesible.
        </Text>

        <Hr style={divider} />

        <Text style={text}>
          Si necesitas cambiar la cita, escríbenos por WhatsApp y la
          movemos sin problema.
        </Text>

        <Text style={closingText}>
          Gracias por habernos elegido,<br />
          El equipo de {SITE_NAME} 💙
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PickupConfirmedEmail,
  subject: 'Recogida confirmada · bebloo',
  displayName: 'Recogida confirmada',
  previewData: {
    customerName: 'María',
    pickupDate: 'Lunes 12 de mayo de 2026',
    pickupWindow: '10:00 – 13:00',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { fontSize: '28px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '0 0 16px' }
const highlightBox = { backgroundColor: '#E8F5E9', borderRadius: '12px', padding: '20px 22px', margin: '20px 0', textAlign: 'center' as const }
const highlightLabel = { fontSize: '12px', fontWeight: '600' as const, color: '#2E5A33', margin: '8px 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const highlightValue = { fontSize: '18px', fontWeight: '700' as const, color: '#2E5A33', margin: '0 0 8px' }
const divider = { borderColor: '#E8F0F7', margin: '24px 0' }
const closingText = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '24px 0 0' }

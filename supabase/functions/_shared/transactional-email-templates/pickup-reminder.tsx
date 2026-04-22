import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface PickupReminderProps {
  customerName?: string
  pickupSchedulerUrl?: string
}

const PickupReminderEmail = ({ customerName, pickupSchedulerUrl = 'https://bebloo.es' }: PickupReminderProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Recuerda programar la recogida de tus productos {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>{SITE_NAME}</Text>
        </Section>

        <Heading style={h1}>
          {customerName ? `${customerName}, ` : ''}
          aún nos queda programar tu recogida
        </Heading>

        <Text style={text}>
          Tu servicio terminó hace unos días y todavía tenemos pendiente
          coordinar la recogida de los productos. En menos de un minuto puedes
          elegir el momento que mejor te venga.
        </Text>

        <Section style={ctaSection}>
          <Button href={pickupSchedulerUrl} style={button}>Programar recogida</Button>
        </Section>

        <Text style={text}>
          Si prefieres seguir disfrutándolos, también puedes renovar desde
          tu cuenta y nos olvidamos de la recogida.
        </Text>

        <Text style={closingText}>
          Con cariño,<br />
          El equipo de {SITE_NAME} 💙
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PickupReminderEmail,
  subject: 'Recuerda programar la recogida de tus productos bebloo',
  displayName: 'Recordatorio de recogida',
  previewData: {
    customerName: 'María',
    pickupSchedulerUrl: 'https://bebloo.es/recogida/abc?token=xyz',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { fontSize: '28px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '0 0 16px' }
const ctaSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = { backgroundColor: '#FF7A6B', color: '#ffffff', padding: '14px 28px', borderRadius: '999px', fontSize: '15px', fontWeight: '600' as const, textDecoration: 'none', display: 'inline-block' }
const closingText = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '24px 0 0' }

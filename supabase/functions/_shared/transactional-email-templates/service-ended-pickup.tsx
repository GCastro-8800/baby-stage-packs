import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface ServiceEndedPickupProps {
  customerName?: string
  pickupSchedulerUrl?: string
  renewUrl?: string
  products?: { name: string }[]
}

const ServiceEndedPickupEmail = ({
  customerName,
  pickupSchedulerUrl = 'https://bebloo.es',
  renewUrl = 'https://bebloo.es/configurador',
  products = [],
}: ServiceEndedPickupProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Tu servicio ha terminado — programa la recogida o renueva</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Text style={logo}>{SITE_NAME}</Text>
        </Section>

        <Heading style={h1}>
          {customerName ? `${customerName}, ` : ''}
          tu servicio con {SITE_NAME} ha terminado
        </Heading>

        <Text style={text}>
          Gracias por confiar en nosotros estos meses. Ahora hay dos caminos
          y los dos son fáciles:
        </Text>

        <Section style={optionBox}>
          <Text style={optionTitle}>1. Programar la recogida</Text>
          <Text style={optionText}>
            Elige el día y la franja horaria que te venga bien. Pasamos
            nosotros a recoger los productos sin coste.
          </Text>
          <Button href={pickupSchedulerUrl} style={buttonPrimary}>Programar recogida</Button>
        </Section>

        <Section style={optionBox}>
          <Text style={optionTitle}>2. Renovar y seguir con nosotros</Text>
          <Text style={optionText}>
            Si quieres mantener los productos un tiempo más, renueva tu
            compromiso y te quedas todo en casa.
          </Text>
          <Button href={renewUrl} style={buttonSecondary}>Renovar servicio</Button>
        </Section>

        {products.length > 0 && (
          <>
            <Hr style={divider} />
            <Text style={productsTitle}>Productos pendientes de recogida:</Text>
            {products.map((p, i) => (
              <Text key={i} style={productItem}>• {p.name}</Text>
            ))}
          </>
        )}

        <Hr style={divider} />

        <Text style={text}>
          Si no nos dices nada en los próximos días, te recordaremos por
          este mismo canal para ayudarte a programar la recogida.
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
  component: ServiceEndedPickupEmail,
  subject: 'Tu servicio bebloo ha terminado · programa la recogida o renueva',
  displayName: 'Servicio terminado · recogida',
  previewData: {
    customerName: 'María',
    pickupSchedulerUrl: 'https://bebloo.es/recogida/abc?token=xyz',
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
const optionBox = { backgroundColor: '#F5FAFF', borderRadius: '12px', padding: '20px 22px', margin: '16px 0' }
const optionTitle = { fontSize: '16px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0 0 6px' }
const optionText = { fontSize: '14px', color: '#4A6B82', lineHeight: '1.5', margin: '0 0 14px' }
const buttonPrimary = { backgroundColor: '#FF7A6B', color: '#ffffff', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: '600' as const, textDecoration: 'none', display: 'inline-block' }
const buttonSecondary = { backgroundColor: '#2B4F6E', color: '#ffffff', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: '600' as const, textDecoration: 'none', display: 'inline-block' }
const divider = { borderColor: '#E8F0F7', margin: '24px 0' }
const productsTitle = { fontSize: '13px', fontWeight: '600' as const, color: '#2B4F6E', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const productItem = { fontSize: '14px', color: '#2B4F6E', margin: '4px 0' }
const closingText = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '24px 0 0' }

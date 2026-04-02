import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
  Section, Row, Column, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "bebloo"

interface OrderItem {
  name: string
  months: number
  pricePerMonth: number
  subtotal: number
}

interface OrderConfirmationProps {
  customerName?: string
  items?: OrderItem[]
  totalPaid?: number
}

const OrderConfirmationEmail = ({ customerName, items, totalPaid }: OrderConfirmationProps) => {
  const displayItems = items ?? []
  const displayTotal = totalPaid ?? 0

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Tu pedido en bebloo está confirmado</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Text style={logo}>bebloo</Text>
          </Section>

          <Heading style={h1}>
            {customerName ? `¡Gracias, ${customerName}! 🎉` : '¡Gracias por tu pedido! 🎉'}
          </Heading>

          <Text style={text}>
            Hemos recibido tu pedido y ya estamos preparando todo para ti.
            A continuación tienes el detalle de lo que has contratado:
          </Text>

          {/* Product table header */}
          {displayItems.length > 0 && (
            <>
              <Section style={tableHeader}>
                <Row>
                  <Column style={{ ...tableHeaderCell, width: '45%' }}>Producto</Column>
                  <Column style={{ ...tableHeaderCell, width: '18%', textAlign: 'center' as const }}>Meses</Column>
                  <Column style={{ ...tableHeaderCell, width: '18%', textAlign: 'right' as const }}>€/mes</Column>
                  <Column style={{ ...tableHeaderCell, width: '19%', textAlign: 'right' as const }}>Subtotal</Column>
                </Row>
              </Section>

              {/* Product rows */}
              {displayItems.map((item, idx) => (
                <Section key={idx} style={idx % 2 === 0 ? tableRowEven : tableRowOdd}>
                  <Row>
                    <Column style={{ ...tableCell, width: '45%' }}>{item.name}</Column>
                    <Column style={{ ...tableCell, width: '18%', textAlign: 'center' as const }}>{item.months}</Column>
                    <Column style={{ ...tableCell, width: '18%', textAlign: 'right' as const }}>{item.pricePerMonth.toFixed(2)} €</Column>
                    <Column style={{ ...tableCell, width: '19%', textAlign: 'right' as const }}>{item.subtotal.toFixed(2)} €</Column>
                  </Row>
                </Section>
              ))}

              {/* Total */}
              <Section style={totalSection}>
                <Row>
                  <Column style={{ width: '63%' }}></Column>
                  <Column style={totalLabel}>Total pagado</Column>
                  <Column style={totalValue}>{displayTotal.toFixed(2)} €</Column>
                </Row>
              </Section>
            </>
          )}

          <Hr style={divider} />

          <Heading as="h2" style={h2}>¿Qué pasa ahora?</Heading>
          <Text style={text}>
            En los próximos 7 días recibirás tu primer envío con todo lo que necesitas.
            Puedes seguir el estado de tu pedido desde tu panel en la app.
          </Text>

          <Text style={text}>
            Si tienes cualquier duda, escríbenos por WhatsApp o responde a este email.
            Estamos aquí para ayudarte.
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
  component: OrderConfirmationEmail,
  subject: '¡Pedido confirmado! Tu suscripción bebloo está en marcha',
  displayName: 'Confirmación de pedido',
  previewData: {
    customerName: 'María',
    items: [
      { name: 'Cuna de viaje', months: 6, pricePerMonth: 15.00, subtotal: 90.00 },
      { name: 'Cochecito urbano', months: 12, pricePerMonth: 25.00, subtotal: 300.00 },
    ],
    totalPaid: 390.00,
  },
} satisfies TemplateEntry

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'DM Sans', Arial, sans-serif",
}

const container = {
  padding: '40px 24px',
  maxWidth: '560px',
  margin: '0 auto',
}

const headerSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const logo = {
  fontSize: '28px',
  fontWeight: '700' as const,
  color: '#2B4F6E',
  margin: '0',
}

const h1 = {
  fontSize: '24px',
  fontWeight: '700' as const,
  color: '#2B4F6E',
  margin: '0 0 16px',
  lineHeight: '1.3',
}

const h2 = {
  fontSize: '18px',
  fontWeight: '600' as const,
  color: '#2B4F6E',
  margin: '24px 0 12px',
}

const text = {
  fontSize: '15px',
  color: '#4A6B82',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const tableHeader = {
  backgroundColor: '#A7D9FF',
  borderRadius: '8px 8px 0 0',
  padding: '0',
}

const tableHeaderCell = {
  fontSize: '12px',
  fontWeight: '600' as const,
  color: '#2B4F6E',
  padding: '10px 12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const tableRowEven = {
  backgroundColor: '#F5FAFF',
  padding: '0',
}

const tableRowOdd = {
  backgroundColor: '#ffffff',
  padding: '0',
}

const tableCell = {
  fontSize: '14px',
  color: '#2B4F6E',
  padding: '10px 12px',
}

const totalSection = {
  backgroundColor: '#2B4F6E',
  borderRadius: '0 0 8px 8px',
  padding: '0',
}

const totalLabel = {
  fontSize: '14px',
  fontWeight: '600' as const,
  color: '#ffffff',
  padding: '12px 12px',
  width: '18%',
  textAlign: 'right' as const,
}

const totalValue = {
  fontSize: '16px',
  fontWeight: '700' as const,
  color: '#ffffff',
  padding: '12px 12px',
  width: '19%',
  textAlign: 'right' as const,
}

const divider = {
  borderColor: '#E8F0F7',
  margin: '24px 0',
}

const closingText = {
  fontSize: '15px',
  color: '#4A6B82',
  lineHeight: '1.6',
  margin: '24px 0 0',
}

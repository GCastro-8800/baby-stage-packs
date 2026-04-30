import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface CartRecoveryDay1Props {
  customerName?: string
  resumeUrl?: string
  productCount?: number
}

const CartRecoveryDay1Email = ({ customerName, resumeUrl, productCount }: CartRecoveryDay1Props) => {
  const ctaUrl = resumeUrl ?? 'https://bebloo.es/configurador'
  const greeting = customerName ? `Hola ${customerName},` : 'Hola,'
  const productLine = productCount && productCount > 0
    ? `Vimos que dejaste tu selección a medias con ${productCount} ${productCount === 1 ? 'producto' : 'productos'}.`
    : 'Vimos que estuviste mirando tu kit en bebloo.'

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Tu selección de bebloo te está esperando</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>bebloo</Text>
          </Section>

          <Heading style={h1}>{greeting}</Heading>

          <Text style={text}>
            {productLine} Sabemos que el primer año con un bebé es un torbellino y
            elegir bien lleva su tiempo.
          </Text>

          <Text style={text}>
            Si tienes alguna duda, escríbenos por WhatsApp o responde a este email.
            Estamos aquí para ayudarte sin prisa y sin compromiso.
          </Text>

          <Section style={ctaSection}>
            <Button href={ctaUrl} style={button}>
              Retomar mi selección
            </Button>
          </Section>

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
  component: CartRecoveryDay1Email,
  subject: 'Tu selección de bebloo te está esperando 💙',
  displayName: 'Rescate de selección — día 1',
  previewData: {
    customerName: 'María',
    resumeUrl: 'https://bebloo.es/configurador',
    productCount: 4,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'DM Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, marginBottom: '24px' }
const logo = { fontSize: '28px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#2B4F6E', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '0 0 16px' }
const ctaSection = { textAlign: 'center' as const, margin: '28px 0' }
const button = { backgroundColor: '#FF8A7A', color: '#ffffff', fontSize: '15px', fontWeight: '600' as const, padding: '14px 28px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }
const closingText = { fontSize: '15px', color: '#4A6B82', lineHeight: '1.6', margin: '24px 0 0' }

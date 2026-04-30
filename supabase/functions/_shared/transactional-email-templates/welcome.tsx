import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'bebloo'

interface WelcomeProps {
  customerName?: string
  configuratorUrl?: string
}

const WelcomeEmail = ({ customerName, configuratorUrl }: WelcomeProps) => {
  const ctaUrl = configuratorUrl ?? 'https://bebloo.es/configurador'

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>Bienvenida a bebloo, nos alegra acompañarte en este Momento</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>bebloo</Text>
          </Section>

          <Heading style={h1}>
            {customerName ? `¡Bienvenida, ${customerName}! 💙` : '¡Bienvenida a bebloo! 💙'}
          </Heading>

          <Text style={text}>
            Nos alegra muchísimo que confíes en nosotros para acompañarte en este Momento.
            Hemos creado bebloo para hacerte la vida un poquito más fácil: tú eliges el kit
            de productos que necesitas, y nosotros nos encargamos del resto.
          </Text>

          <Heading as="h2" style={h2}>¿Cómo funciona?</Heading>
          <Text style={text}>
            • Elige los productos del kit que mejor se adapten a vuestro día a día.<br />
            • Decide durante cuántos meses los quieres en casa (mínimo 3).<br />
            • Recibirás todo el material en un único envío, sin preocupaciones.<br />
            • Cuando termine el servicio, pasamos a recogerlo. Tan sencillo como eso.
          </Text>

          <Section style={ctaSection}>
            <Button href={ctaUrl} style={button}>
              Configurar mi kit
            </Button>
          </Section>

          <Text style={text}>
            Si tienes cualquier duda mientras lo piensas, escríbenos por WhatsApp o responde
            a este email. Estamos aquí para ayudarte sin prisa.
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
  component: WelcomeEmail,
  subject: '¡Bienvenida a bebloo! 💙',
  displayName: 'Bienvenida tras crear cuenta',
  previewData: {
    customerName: 'María',
    configuratorUrl: 'https://bebloo.es/configurador',
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

const ctaSection = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const button = {
  backgroundColor: '#FF8A7A',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '14px 28px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}

const closingText = {
  fontSize: '15px',
  color: '#4A6B82',
  lineHeight: '1.6',
  margin: '24px 0 0',
}

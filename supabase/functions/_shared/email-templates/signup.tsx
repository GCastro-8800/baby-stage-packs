/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

import {
  LOGO_URL, main, container, headerSection, logoImg, bodySection,
  h1, text, link, button, footer,
} from './styles.ts'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma tu email en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logoImg} />
        </Section>
        <Section style={bodySection}>
          <Heading style={h1}>¡Bienvenido/a! 💙</Heading>
          <Text style={text}>
            Gracias por registrarte en{' '}
            <Link href={siteUrl} style={link}>
              <strong>{siteName}</strong>
            </Link>
            . Estamos encantados de acompañarte en esta etapa.
          </Text>
          <Text style={text}>
            Confirma tu dirección de email (
            <Link href={`mailto:${recipient}`} style={link}>
              {recipient}
            </Link>
            ) haciendo clic en el botón:
          </Text>
          <Button style={button} href={confirmationUrl}>
            Confirmar email
          </Button>
          <Text style={footer}>
            Si no creaste una cuenta, puedes ignorar este email con tranquilidad.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

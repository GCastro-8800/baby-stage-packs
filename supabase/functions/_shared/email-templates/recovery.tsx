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
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'

import {
  LOGO_URL, main, container, headerSection, logoImg, bodySection,
  h1, text, button, footer,
} from './styles.ts'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Restablece tu contraseña en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logoImg} />
        </Section>
        <Section style={bodySection}>
          <Heading style={h1}>Restablecer contraseña</Heading>
          <Text style={text}>
            Hemos recibido una solicitud para restablecer tu contraseña en {siteName}.
            Haz clic en el botón para elegir una nueva:
          </Text>
          <Button style={button} href={confirmationUrl}>
            Restablecer contraseña
          </Button>
          <Text style={footer}>
            Si no solicitaste este cambio, puedes ignorar este email. Tu contraseña no se modificará.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

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

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Confirma el cambio de email en {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logoImg} />
        </Section>
        <Section style={bodySection}>
          <Heading style={h1}>Confirma el cambio de email</Heading>
          <Text style={text}>
            Has solicitado cambiar tu dirección de email en {siteName} de{' '}
            <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
            a{' '}
            <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
          </Text>
          <Text style={text}>
            Haz clic en el botón para confirmar el cambio:
          </Text>
          <Button style={button} href={confirmationUrl}>
            Confirmar cambio de email
          </Button>
          <Text style={footer}>
            Si no solicitaste este cambio, protege tu cuenta inmediatamente.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

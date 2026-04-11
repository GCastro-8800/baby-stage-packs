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

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="es" dir="ltr">
    <Head />
    <Preview>Te han invitado a {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Img src={LOGO_URL} alt={siteName} width="120" height="40" style={logoImg} />
        </Section>
        <Section style={bodySection}>
          <Heading style={h1}>Te han invitado 🎉</Heading>
          <Text style={text}>
            Has sido invitado/a a unirte a{' '}
            <Link href={siteUrl} style={link}>
              <strong>{siteName}</strong>
            </Link>
            . Haz clic en el botón para aceptar la invitación y crear tu cuenta.
          </Text>
          <Button style={button} href={confirmationUrl}>
            Aceptar invitación
          </Button>
          <Text style={footer}>
            Si no esperabas esta invitación, puedes ignorar este email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

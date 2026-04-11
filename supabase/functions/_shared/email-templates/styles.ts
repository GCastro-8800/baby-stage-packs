/// <reference types="npm:@types/react@18.3.1" />

// Shared styles for all bebloo email templates
// Brand colors extracted from src/index.css

export const LOGO_URL = 'https://okxfhhbqxsxtdlneliax.supabase.co/storage/v1/object/public/email-assets/logo-bebloo.png'

// Colors
export const colors = {
  primary: '#A7D9FF',        // --primary: 205 100% 83%
  foreground: '#2B4F6E',     // --foreground: 205 40% 20%
  coral: '#F77F77',          // --accent: 0 89% 72%
  muted: '#8BA3B5',          // --muted-foreground
  textBody: '#4A6B82',       // body text
  bgLight: '#F0F7FF',        // soft blue bg for header
  white: '#ffffff',
}

// Shared inline styles
export const main = {
  backgroundColor: colors.white,
  fontFamily: "'DM Sans', Arial, sans-serif",
}

export const container = {
  padding: '0',
  maxWidth: '560px',
  margin: '0 auto',
}

export const headerSection = {
  textAlign: 'center' as const,
  padding: '32px 24px 24px',
  backgroundColor: colors.bgLight,
  borderRadius: '0 0 24px 24px',
}

export const logoImg = {
  margin: '0 auto',
  display: 'block' as const,
}

export const bodySection = {
  padding: '32px 24px 40px',
}

export const h1 = {
  fontFamily: "'Fraunces', Georgia, serif",
  fontSize: '24px',
  fontWeight: '600' as const,
  color: colors.foreground,
  margin: '0 0 16px',
  lineHeight: '1.3',
}

export const text = {
  fontSize: '15px',
  color: colors.textBody,
  lineHeight: '1.6',
  margin: '0 0 16px',
}

export const link = {
  color: colors.foreground,
  textDecoration: 'underline',
}

export const button = {
  backgroundColor: colors.coral,
  color: colors.white,
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '12px',
  padding: '14px 24px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}

export const footer = {
  fontSize: '13px',
  color: colors.muted,
  margin: '30px 0 0',
  lineHeight: '1.5',
}

export const codeStyle = {
  fontFamily: "'DM Sans', Courier, monospace",
  fontSize: '28px',
  fontWeight: '700' as const,
  color: colors.foreground,
  margin: '0 0 30px',
  letterSpacing: '4px',
}

export const divider = {
  borderTop: `1px solid ${colors.primary}`,
  margin: '24px 0',
}

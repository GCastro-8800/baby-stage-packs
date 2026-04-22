/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as serviceEndingSoon } from './service-ending-soon.tsx'
import { template as serviceEndedPickup } from './service-ended-pickup.tsx'
import { template as pickupReminder } from './pickup-reminder.tsx'
import { template as pickupConfirmed } from './pickup-confirmed.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'order-confirmation': orderConfirmation,
  'service-ending-soon': serviceEndingSoon,
  'service-ended-pickup': serviceEndedPickup,
  'pickup-reminder': pickupReminder,
  'pickup-confirmed': pickupConfirmed,
}

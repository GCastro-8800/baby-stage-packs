// Bebloo cookie consent — module to manage consent state, persistence,
// and synchronization with Google Consent Mode v2.

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = "bebloo_consent_v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 180; // 180 days
const EVENT_NAME = "bebloo_consent_update";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function safeParse(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed?.timestamp !== "number") return null;
    if (Date.now() - parsed.timestamp > MAX_AGE_MS) return null;
    return {
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function hasConsent(): boolean {
  return getConsent() !== null;
}

function pushToGtag(state: ConsentState) {
  if (typeof window === "undefined") return;
  // Ensure dataLayer + gtag stub exist even if GA hasn't loaded yet.
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
  });
}

export function setConsent(partial: { analytics: boolean; marketing: boolean }): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: !!partial.analytics,
    marketing: !!partial.marketing,
    timestamp: Date.now(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    pushToGtag(state);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: state }));
  }
  return state;
}

export function acceptAll() {
  return setConsent({ analytics: true, marketing: true });
}

export function rejectAll() {
  return setConsent({ analytics: false, marketing: false });
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: null }));
}

export function onConsentChange(cb: (state: ConsentState | null) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentState | null>).detail ?? getConsent();
    cb(detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

export const CONSENT_EVENT = EVENT_NAME;

// Custom event to request opening the preferences dialog from anywhere.
export const OPEN_PREFERENCES_EVENT = "bebloo_open_cookie_preferences";

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_PREFERENCES_EVENT));
}

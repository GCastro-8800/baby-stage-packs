import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import * as Sentry from "@sentry/react";
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

const SENTRY_DSN =
  "https://5a8991dbffa9f9a28dad382152dfdc71@o4511253436301312.ingest.de.sentry.io/4511259453161552";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: import.meta.env.PROD ? "production" : "preview",
  release: (import.meta.env.VITE_APP_VERSION as string | undefined) ?? "dev",
  sendDefaultPii: false,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event, hint) {
    const msg =
      (hint?.originalException as Error | undefined)?.message ??
      event.message ??
      "";
    if (
      msg.includes("ResizeObserver loop limit exceeded") ||
      msg.includes("ResizeObserver loop completed with undelivered notifications")
    ) {
      return null;
    }
    return event;
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

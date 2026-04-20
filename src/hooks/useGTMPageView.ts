import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

/**
 * Pushes a `page_view` event to GTM's dataLayer on every SPA route change.
 * Skips the first render because GTM already fires an automatic page_view
 * when `gtm.js` loads on initial HTML load. This avoids duplicate pageviews.
 */
export function useGTMPageView() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "page_view",
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search]);
}

import { useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type EventType = 
  | "page_view" 
  | "cta_click" 
  | "pricing_click" 
  | "modal_open" 
  | "lead_captured"
  | "plan_detail_view"
  | "contact_click"
  | "equipment_selection"
  | "plan_upgrade_click"
  | "checkout_start";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

const getSessionId = (): string => {
  const stored = sessionStorage.getItem("analytics_session_id");
  if (stored) return stored;
  const newId = crypto.randomUUID();
  sessionStorage.setItem("analytics_session_id", newId);
  return newId;
};

export const useAnalytics = () => {
  const sessionId = useRef<string>(getSessionId());

  const track = useCallback(async (eventType: EventType, eventData?: EventData) => {
    try {
      await supabase.from("analytics_events").insert({
        event_type: eventType,
        event_data: eventData || {},
        session_id: sessionId.current,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      // Silently fail - analytics should never break the app
      console.error("Analytics error:", error);
    }
  }, []);

  return { track };
};

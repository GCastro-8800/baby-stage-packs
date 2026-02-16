import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { PG_UNIQUE_VIOLATION } from "@/lib/constants";

interface LeadInsertData {
  email: string;
  plan: string;
  postal_code?: string | null;
  user_id?: string | null;
  selected_products?: string[] | null;
}

interface EmailPayload {
  email: string;
  plan: string;
  postalCode?: string;
  selectedProducts?: string[];
}

interface UseLeadCaptureOptions {
  onSuccess?: () => void;
}

export function useLeadCapture(options?: UseLeadCaptureOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const { track } = useAnalytics();

  const submitLead = async (
    insertData: LeadInsertData,
    emailPayload?: EmailPayload,
    trackData?: Record<string, unknown>,
  ) => {
    setIsLoading(true);

    const { error } = await supabase.from("leads").insert(insertData);

    if (error) {
      setIsLoading(false);
      if (error.code === PG_UNIQUE_VIOLATION) {
        toast({
          title: "Ya te habías registrado",
          description: "Este email ya está en nuestra lista. Te avisaremos pronto.",
        });
        setIsSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Algo salió mal",
          description: "No pudimos guardar tu información. Inténtalo de nuevo.",
        });
      }
      return;
    }

    // Send confirmation email (fire-and-forget)
    if (emailPayload) {
      try {
        await supabase.functions.invoke("send-confirmation-email", {
          body: emailPayload,
        });
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    setIsLoading(false);
    setIsSubmitted(true);
    track("lead_captured", trackData || {});
    options?.onSuccess?.();
  };

  const reset = () => {
    setIsSubmitted(false);
    setIsLoading(false);
  };

  return { submitLead, isLoading, isSubmitted, reset };
}

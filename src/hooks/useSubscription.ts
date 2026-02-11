import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Subscription {
  id: string;
  user_id: string;
  status: "active" | "paused" | "cancelled";
  plan_name: string;
  current_stage: string;
  next_shipment_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  id: string;
  subscription_id: string;
  user_id: string;
  status: "scheduled" | "packed" | "shipped" | "delivered";
  stage: string;
  scheduled_date: string;
  shipped_date: string | null;
  delivered_date: string | null;
  items: ShipmentItem[];
  created_at: string;
  updated_at: string;
}

export interface ShipmentItem {
  key: string;
  name: string;
  brand: string;
  model: string;
  category: string;
}

export interface Feedback {
  id: string;
  user_id: string;
  shipment_id: string;
  item_key: string;
  rating: "useful" | "not_useful";
  comment: string | null;
  created_at: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const shipmentsQuery = useQuery({
    queryKey: ["shipments", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", user!.id)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      return (data || []).map((s) => ({
        ...s,
        items: (Array.isArray(s.items) ? s.items : []) as unknown as ShipmentItem[],
      })) as Shipment[];
    },
    enabled: !!user,
  });

  const feedbackQuery = useQuery({
    queryKey: ["feedback", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user!.id);

      if (error) throw error;
      return (data || []) as Feedback[];
    },
    enabled: !!user,
  });

  const submitFeedback = useMutation({
    mutationFn: async (params: { shipmentId: string; itemKey: string; rating: "useful" | "not_useful"; comment?: string }) => {
      const { data, error } = await supabase
        .from("feedback")
        .upsert(
          {
            user_id: user!.id,
            shipment_id: params.shipmentId,
            item_key: params.itemKey,
            rating: params.rating,
            comment: params.comment || null,
          },
          { onConflict: "shipment_id,item_key" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback", user?.id] });
    },
  });

  // Get the next upcoming shipment
  const nextShipment = shipmentsQuery.data?.find(
    (s) => s.status === "scheduled" || s.status === "packed"
  );

  // Get the most recent delivered shipment
  const lastDelivered = shipmentsQuery.data?.find(
    (s) => s.status === "delivered"
  );

  return {
    subscription: subscriptionQuery.data,
    subscriptionLoading: subscriptionQuery.isLoading,
    shipments: shipmentsQuery.data || [],
    nextShipment,
    lastDelivered,
    feedback: feedbackQuery.data || [],
    submitFeedback,
  };
}

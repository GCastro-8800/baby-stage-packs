import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Subscription {
  id: string;
  user_id: string;
  status: "active" | "paused" | "cancelled" | "expired";
  plan_name: string;
  current_stage: string;
  next_shipment_date: string | null;
  end_date: string | null;
  pickup_status: "pending" | "scheduled" | "completed" | "cancelled";
  pickup_scheduled_date: string | null;
  pickup_window: string | null;
  created_at: string;
  updated_at: string;
}

export function daysUntilEnd(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate + "T00:00:00").getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((end - now.getTime()) / (1000 * 60 * 60 * 24));
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

interface SubscriptionOverview {
  subscription: Subscription | null;
  shipments: Shipment[];
  feedback: Feedback[];
}

export function useSubscription() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const overviewQuery = useQuery({
    queryKey: ["subscription-overview", user?.id],
    queryFn: async (): Promise<SubscriptionOverview> => {
      const { data, error } = await supabase.rpc("get_user_subscription_overview");
      if (error) throw error;
      const raw = (data ?? {}) as {
        subscription: Subscription | null;
        shipments: Array<Omit<Shipment, "items"> & { items: unknown }>;
        feedback: Feedback[];
      };
      return {
        subscription: raw.subscription ?? null,
        shipments: (raw.shipments ?? []).map((s) => ({
          ...s,
          items: (Array.isArray(s.items) ? s.items : []) as ShipmentItem[],
        })),
        feedback: raw.feedback ?? [],
      };
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
      queryClient.invalidateQueries({ queryKey: ["subscription-overview", user?.id] });
    },
  });

  const shipments = overviewQuery.data?.shipments ?? [];

  const nextShipment = useMemo(
    () => shipments.find((s) => s.status === "scheduled" || s.status === "packed"),
    [shipments]
  );

  const lastDelivered = useMemo(
    () => shipments.find((s) => s.status === "delivered"),
    [shipments]
  );

  return {
    subscription: overviewQuery.data?.subscription ?? null,
    subscriptionLoading: overviewQuery.isLoading,
    shipments,
    nextShipment,
    lastDelivered,
    feedback: overviewQuery.data?.feedback ?? [],
    submitFeedback,
  };
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface StripeSubscriptionStatus {
  subscribed: boolean;
  subscription_end: string | null;
  items: { name: string; amount: number; interval: string }[];
}

export function useStripeSubscription() {
  const { user, session } = useAuth();

  const query = useQuery({
    queryKey: ["stripe-subscription", user?.id],
    queryFn: async (): Promise<StripeSubscriptionStatus> => {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      return data as StripeSubscriptionStatus;
    },
    enabled: !!user && !!session,
    refetchInterval: false,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60_000,
  });

  return {
    subscribed: query.data?.subscribed ?? false,
    subscriptionEnd: query.data?.subscription_end ?? null,
    stripeItems: query.data?.items ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Child, Situation } from "@/types/baby";

interface CreateChildData {
  name?: string;
  situation: Situation;
  due_date?: string | null;
  birth_date?: string | null;
}

interface UpdateChildData extends CreateChildData {
  id: string;
}

export function useChildren() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const childrenQuery = useQuery({
    queryKey: ["children", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as Child[];
    },
    enabled: !!user,
  });

  const children = childrenQuery.data ?? [];
  const activeChild = children.find((c) => c.is_active) ?? children[0] ?? null;
  const canAddMore = children.length < 5;

  const createChild = useMutation({
    mutationFn: async (data: CreateChildData) => {
      if (!user) throw new Error("Not authenticated");
      const isFirst = children.length === 0;
      const { error } = await supabase.from("children").insert({
        user_id: user.id,
        name: data.name ?? null,
        situation: data.situation,
        due_date: data.due_date ?? null,
        birth_date: data.birth_date ?? null,
        is_active: isFirst,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["children", user?.id] }),
  });

  const updateChild = useMutation({
    mutationFn: async (data: UpdateChildData) => {
      const { error } = await supabase
        .from("children")
        .update({
          name: data.name ?? null,
          situation: data.situation,
          due_date: data.due_date ?? null,
          birth_date: data.birth_date ?? null,
        })
        .eq("id", data.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["children", user?.id] }),
  });

  const deleteChild = useMutation({
    mutationFn: async (childId: string) => {
      const { error } = await supabase.from("children").delete().eq("id", childId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["children", user?.id] }),
  });

  const setActiveChild = useMutation({
    mutationFn: async (childId: string) => {
      if (!user) throw new Error("Not authenticated");
      // Deactivate all
      await supabase.from("children").update({ is_active: false }).eq("user_id", user.id);
      // Activate selected
      const { error } = await supabase.from("children").update({ is_active: true }).eq("id", childId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["children", user?.id] }),
  });

  return {
    children,
    activeChild,
    canAddMore,
    isLoading: childrenQuery.isLoading,
    createChild,
    updateChild,
    deleteChild,
    setActiveChild,
  };
}

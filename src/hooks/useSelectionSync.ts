import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SELECTION_CHANGED_EVENT } from "@/hooks/useSelectionCount";

const STORAGE_KEY = "bebloo_selection";

interface StoredSelection {
  productIds: string[];
  durations: Record<string, number>;
}

function readLocal(): StoredSelection {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { productIds: [], durations: {} };
    const parsed = JSON.parse(raw);
    return {
      productIds: Array.isArray(parsed.productIds) ? parsed.productIds : [],
      durations: parsed.durations ?? {},
    };
  } catch {
    return { productIds: [], durations: {} };
  }
}

function writeLocal(sel: StoredSelection) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
  window.dispatchEvent(new Event(SELECTION_CHANGED_EVENT));
}

/**
 * Syncs the localStorage cart with the user_selections table.
 * - On login: merges (union of products, local takes priority for durations).
 * - Then watches changes and upserts (debounced).
 */
export function useSelectionSync() {
  const { user } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial sync on login
  useEffect(() => {
    if (!user) {
      lastUserIdRef.current = null;
      return;
    }
    if (lastUserIdRef.current === user.id) return;
    lastUserIdRef.current = user.id;

    (async () => {
      const local = readLocal();
      const { data, error } = await supabase
        .from("user_selections")
        .select("product_ids, durations")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("[selection-sync] fetch error", error);
        return;
      }

      const remoteIds: string[] = (data?.product_ids as string[] | undefined) ?? [];
      const remoteDurations: Record<string, number> =
        (data?.durations as Record<string, number> | undefined) ?? {};

      // Merge: union of ids, local durations take priority
      const mergedIds = Array.from(new Set([...remoteIds, ...local.productIds]));
      const mergedDurations: Record<string, number> = {
        ...remoteDurations,
        ...local.durations,
      };

      const merged: StoredSelection = {
        productIds: mergedIds,
        durations: mergedDurations,
      };

      // Update local if remote contributed something new
      const localChanged =
        mergedIds.length !== local.productIds.length ||
        mergedIds.some((id) => !local.productIds.includes(id));
      if (localChanged) writeLocal(merged);

      // Upsert merged to remote
      await supabase.from("user_selections").upsert({
        user_id: user.id,
        product_ids: mergedIds,
        durations: mergedDurations as never,
        updated_at: new Date().toISOString(),
      });
    })();
  }, [user]);

  // Watch for cart changes and push to remote (debounced)
  useEffect(() => {
    if (!user) return;

    const push = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const local = readLocal();
        await supabase.from("user_selections").upsert({
          user_id: user.id,
          product_ids: local.productIds,
          durations: local.durations as never,
          updated_at: new Date().toISOString(),
        });
      }, 500);
    };

    window.addEventListener(SELECTION_CHANGED_EVENT, push);
    return () => {
      window.removeEventListener(SELECTION_CHANGED_EVENT, push);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user]);
}

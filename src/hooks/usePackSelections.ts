import { useCallback, useSyncExternalStore } from "react";
import type { PackConfig } from "@/data/packStages";

interface StageSelections {
  selectedFixed: Set<string>;
  selectedChoice: Set<string>;
  variantChoices: Record<string, number>;
}

type PackStore = Record<string, Record<string, StageSelections>>;

// Module-level global store
let store: PackStore = {};
const listeners = new Set<() => void>();

function emitChange() {
  // Create new reference to trigger re-render
  store = { ...store };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return store;
}

export function usePackSelections(packId: string) {
  const state = useSyncExternalStore(subscribe, getSnapshot);
  const packState = state[packId] || {};

  const initStageIfNeeded = useCallback(
    (stageId: string, fixedKeys: string[], choiceKeys: string[], products: { category: string; type: string }[]) => {
      if (store[packId]?.[stageId]) return; // Already initialized
      const sel: StageSelections = {
        selectedFixed: new Set(fixedKeys),
        selectedChoice: new Set(choiceKeys),
        variantChoices: {},
      };
      products
        .filter((c) => c.type === "choice")
        .forEach((c) => {
          sel.variantChoices[c.category] = 0;
        });
      store = {
        ...store,
        [packId]: { ...store[packId], [stageId]: sel },
      };
      emitChange();
    },
    [packId]
  );

  const getStageSelections = useCallback(
    (stageId: string): StageSelections | undefined => packState[stageId],
    [packState]
  );

  const updateStageSelections = useCallback(
    (stageId: string, updater: (prev: StageSelections) => StageSelections) => {
      const current = store[packId]?.[stageId];
      if (!current) return;
      const updated = updater(current);
      store = {
        ...store,
        [packId]: { ...store[packId], [stageId]: updated },
      };
      emitChange();
    },
    [packId]
  );

  const isPackComplete = useCallback(
    (pack: PackConfig): boolean => {
      return pack.stages.every((stage) => {
        const sel = store[packId]?.[stage.id];
        if (!sel) return true; // Not visited yet = default all selected
        const fixedKeys = stage.products.filter((c) => c.type === "fixed").map((c) => c.category);
        const choiceKeys = stage.products.filter((c) => c.type === "choice").map((c) => c.category);
        return (
          fixedKeys.every((k) => sel.selectedFixed.has(k)) &&
          choiceKeys.every((k) => sel.selectedChoice.has(k))
        );
      });
    },
    [packId]
  );

  const calculateTotalPrice = useCallback(
    (pack: PackConfig): number => {
      const complete = isPackComplete(pack);
      let total = 0;
      pack.stages.forEach((stage) => {
        const sel = store[packId]?.[stage.id];
        stage.products.forEach((cat) => {
          const isFixed = cat.type === "fixed";
          const isSelected = sel
            ? isFixed
              ? sel.selectedFixed.has(cat.category)
              : sel.selectedChoice.has(cat.category)
            : true; // Not visited = selected by default
          if (!isSelected) return;
          const idx = !isFixed && sel ? sel.variantChoices[cat.category] || 0 : 0;
          const opt = cat.options[idx];
          if (!opt) return;
          // Pack complete → use pack price; incomplete → individual price
          total += complete ? (opt.precio_en_pack || 0) : (opt.precio_individual || 0);
        });
      });
      return total + pack.serviceFee;
    },
    [packId, isPackComplete]
  );

  const getGlobalCounts = useCallback(
    (pack: PackConfig): { selectedCount: number; totalCount: number } => {
      let selectedCount = 0;
      let totalCount = 0;
      pack.stages.forEach((stage) => {
        const sel = store[packId]?.[stage.id];
        stage.products.forEach((cat) => {
          totalCount++;
          const isFixed = cat.type === "fixed";
          const isSelected = sel
            ? isFixed
              ? sel.selectedFixed.has(cat.category)
              : sel.selectedChoice.has(cat.category)
            : true;
          if (isSelected) selectedCount++;
        });
      });
      return { selectedCount, totalCount };
    },
    [packId]
  );

  const getGlobalProductBreakdown = useCallback(
    (pack: PackConfig) => {
      const items: { name: string; precio_en_pack: number; precio_individual: number; included: boolean }[] = [];
      pack.stages.forEach((stage) => {
        const sel = store[packId]?.[stage.id];
        stage.products.forEach((cat) => {
          const isFixed = cat.type === "fixed";
          const isSelected = sel
            ? isFixed
              ? sel.selectedFixed.has(cat.category)
              : sel.selectedChoice.has(cat.category)
            : true;
          const idx = !isFixed && sel ? sel.variantChoices[cat.category] || 0 : 0;
          const opt = cat.options[idx];
          if (!opt) return;
          items.push({
            name: `${opt.brand} ${opt.model}`,
            precio_en_pack: opt.precio_en_pack || 0,
            precio_individual: opt.precio_individual || 0,
            included: isSelected,
          });
        });
      });
      return items;
    },
    [packId]
  );

  const getSelectedItemsMap = useCallback(
    (pack: PackConfig): Record<string, boolean> => {
      const map: Record<string, boolean> = {};
      pack.stages.forEach((stage) => {
        const sel = store[packId]?.[stage.id];
        stage.products.forEach((cat) => {
          const isFixed = cat.type === "fixed";
          const isSelected = sel
            ? isFixed
              ? sel.selectedFixed.has(cat.category)
              : sel.selectedChoice.has(cat.category)
            : true;
          const idx = !isFixed && sel ? sel.variantChoices[cat.category] || 0 : 0;
          const opt = cat.options[idx];
          if (opt) {
            const key = `${cat.category}::${opt.model}`;
            map[key] = isSelected;
          }
        });
      });
      return map;
    },
    [packId]
  );

  return {
    packState,
    initStageIfNeeded,
    getStageSelections,
    updateStageSelections,
    isPackComplete,
    calculateTotalPrice,
    getGlobalCounts,
    getGlobalProductBreakdown,
    getSelectedItemsMap,
  };
}

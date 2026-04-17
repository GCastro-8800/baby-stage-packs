import { useState, useEffect } from "react";

const STORAGE_KEY = "bebloo_selection";
export const SELECTION_CHANGED_EVENT = "bebloo:selection-changed";

function readCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.productIds) ? parsed.productIds.length : 0;
  } catch {
    return 0;
  }
}

export function useSelectionCount(): number {
  const [count, setCount] = useState<number>(() => readCount());

  useEffect(() => {
    const update = () => setCount(readCount());
    window.addEventListener("storage", update);
    window.addEventListener(SELECTION_CHANGED_EVENT, update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(SELECTION_CHANGED_EVENT, update);
    };
  }, []);

  return count;
}

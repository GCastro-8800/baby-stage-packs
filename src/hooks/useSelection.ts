import { useState, useCallback, useMemo, useEffect } from "react";
import { Product, getProductById } from "@/data/productCatalog";
import { QuestionnaireAnswers } from "@/data/recommendationEngine";
import { DEFAULT_DURATION, getDiscountForMonths } from "@/lib/constants";

const STORAGE_KEY = "bebloo_selection";

interface StoredSelection {
  productIds: string[];
  durations: Record<string, number>;
}

function loadFromStorage(): StoredSelection | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSelection;
  } catch {
    return null;
  }
}

function saveToStorage(products: Map<string, Product>, durations: Map<string, number>) {
  const data: StoredSelection = {
    productIds: Array.from(products.keys()),
    durations: Object.fromEntries(durations),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export interface SelectionState {
  selectedProducts: Map<string, Product>;
  questionnaireAnswers?: QuestionnaireAnswers;
}

export function useSelection(initialProducts: Product[] = [], answers?: QuestionnaireAnswers) {
  const [selectedProducts, setSelectedProducts] = useState<Map<string, Product>>(() => {
    // If initialProducts come from questionnaire, they take priority
    if (initialProducts.length > 0) {
      const map = new Map<string, Product>();
      initialProducts.forEach((p) => map.set(p.id, p));
      return map;
    }
    // Otherwise load from localStorage
    const stored = loadFromStorage();
    if (stored && stored.productIds.length > 0) {
      const map = new Map<string, Product>();
      stored.productIds.forEach((id) => {
        const p = getProductById(id);
        if (p) map.set(id, p);
      });
      return map;
    }
    // Default: 4 products (one per main category)
    const defaults = ["bugaboo-fox-3", "stokke-sleepi-mini", "babybjorn-bliss", "ergobaby-omni"];
    const map = new Map<string, Product>();
    defaults.forEach((id) => {
      const p = getProductById(id);
      if (p) map.set(id, p);
    });
    return map;
  });

  const [durations, setDurations] = useState<Map<string, number>>(() => {
    if (initialProducts.length > 0) {
      const map = new Map<string, number>();
      initialProducts.forEach((p) => map.set(p.id, DEFAULT_DURATION));
      return map;
    }
    const stored = loadFromStorage();
    if (stored && stored.productIds.length > 0) {
      const map = new Map<string, number>();
      Object.entries(stored.durations).forEach(([id, months]) => {
        map.set(id, months);
      });
      return map;
    }
    // Default durations for default products
    const defaults = ["bugaboo-fox-3", "stokke-sleepi-mini", "babybjorn-bliss", "ergobaby-omni"];
    const map = new Map<string, number>();
    defaults.forEach((id) => {
      const p = getProductById(id);
      if (p) map.set(id, DEFAULT_DURATION);
    });
    return map;
  });

  const [questionnaireAnswers] = useState<QuestionnaireAnswers | undefined>(answers);

  // Persist to localStorage on changes
  useEffect(() => {
    saveToStorage(selectedProducts, durations);
  }, [selectedProducts, durations]);

  const addProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      next.set(product.id, product);
      return next;
    });
    setDurations((prev) => {
      const next = new Map(prev);
      if (!next.has(product.id)) {
        next.set(product.id, DEFAULT_DURATION);
      }
      return next;
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
    setDurations((prev) => {
      const next = new Map(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const swapProduct = useCallback((oldProductId: string, newProduct: Product) => {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      next.delete(oldProductId);
      next.set(newProduct.id, newProduct);
      return next;
    });
    setDurations((prev) => {
      const next = new Map(prev);
      const oldDuration = next.get(oldProductId) ?? DEFAULT_DURATION;
      next.delete(oldProductId);
      next.set(newProduct.id, oldDuration);
      return next;
    });
  }, []);

  const setDuration = useCallback((productId: string, months: number) => {
    setDurations((prev) => {
      const next = new Map(prev);
      next.set(productId, months);
      return next;
    });
  }, []);

  const getDuration = useCallback(
    (productId: string) => durations.get(productId) ?? DEFAULT_DURATION,
    [durations]
  );

  const getDiscountedPrice = useCallback(
    (product: Product) => {
      const months = durations.get(product.id) ?? DEFAULT_DURATION;
      const discount = getDiscountForMonths(months);
      return Math.round(product.pricePerMonth * (1 - discount));
    },
    [durations]
  );

  const isSelected = useCallback(
    (productId: string) => selectedProducts.has(productId),
    [selectedProducts]
  );

  const clearAll = useCallback(() => {
    setSelectedProducts(new Map());
    setDurations(new Map());
  }, []);

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((p) => {
      total += getDiscountedPrice(p);
    });
    return total;
  }, [selectedProducts, getDiscountedPrice]);

  const productList = useMemo(
    () => Array.from(selectedProducts.values()),
    [selectedProducts]
  );

  return {
    selectedProducts,
    productList,
    totalPrice,
    addProduct,
    removeProduct,
    swapProduct,
    isSelected,
    clearAll,
    questionnaireAnswers,
    count: selectedProducts.size,
    durations,
    setDuration,
    getDuration,
    getDiscountedPrice,
  };
}

import { useState, useCallback, useMemo } from "react";
import { Product } from "@/data/productCatalog";
import { QuestionnaireAnswers } from "@/data/recommendationEngine";

export interface SelectionState {
  selectedProducts: Map<string, Product>;
  questionnaireAnswers?: QuestionnaireAnswers;
}

export function useSelection(initialProducts: Product[] = [], answers?: QuestionnaireAnswers) {
  const [selectedProducts, setSelectedProducts] = useState<Map<string, Product>>(() => {
    const map = new Map<string, Product>();
    initialProducts.forEach((p) => map.set(p.id, p));
    return map;
  });

  const [questionnaireAnswers] = useState<QuestionnaireAnswers | undefined>(answers);

  const addProduct = useCallback((product: Product) => {
    setSelectedProducts((prev) => {
      const next = new Map(prev);
      next.set(product.id, product);
      return next;
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setSelectedProducts((prev) => {
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
  }, []);

  const isSelected = useCallback(
    (productId: string) => selectedProducts.has(productId),
    [selectedProducts]
  );

  const clearAll = useCallback(() => {
    setSelectedProducts(new Map());
  }, []);

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedProducts.forEach((p) => {
      total += p.pricePerMonth;
    });
    return total;
  }, [selectedProducts]);

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
  };
}

import { Product, PRODUCT_CATALOG } from "./productCatalog";

export interface QuestionnaireAnswers {
  dueDate: string;
  housing: "small-apartment" | "spacious" | "no-elevator";
  concerns: string[];
  existingEquipment: "nothing" | "some" | "specific";
}

export function getRecommendation(answers: QuestionnaireAnswers): Product[] {
  const selected: Product[] = [];

  const wantsBest = answers.concerns.includes("best-quality");
  const budgetTight = answers.concerns.includes("tight-budget");
  const smallSpace = answers.housing === "small-apartment" || answers.housing === "no-elevator";
  const startFromZero = answers.existingEquipment === "nothing";
  const hasSome = answers.existingEquipment === "some";

  // — CARRITO —
  if (wantsBest && !smallSpace) {
    const product = findProduct("bugaboo-fox-3");
    if (product) selected.push(product);
  } else if (budgetTight || smallSpace) {
    const product = findProduct("babyzen-yoyo3");
    if (product) selected.push(product);
  } else {
    const product = findProduct("joolz-aer-2");
    if (product) selected.push(product);
  }

  // — CUNA —
  if (wantsBest) {
    const product = findProduct("stokke-sleepi-mini");
    if (product) selected.push(product);
  } else {
    const product = findProduct("moises-mimbre");
    if (product) selected.push(product);
  }

  // — PORTEO —
  if (startFromZero) {
    if (wantsBest) {
      const product = findProduct("nuna-leaf-grow");
      if (product) selected.push(product);
    } else {
      const product = findProduct("ergobaby-omni");
      if (product) selected.push(product);
    }
  } else if (hasSome) {
    const product = findProduct("ergobaby-omni");
    if (product) selected.push(product);
  }
  // "specific" → skip (no porteo recommendation)

  // — CAMBIADOR (only if starting from zero) —
  if (startFromZero) {
    const product = findProduct("cambiador");
    if (product) selected.push(product);
  }

  return selected;
}

export function getStageSuggestions(stage?: string): Product[] {
  if (!stage) return [];
  return PRODUCT_CATALOG.filter((p) => p.stage === stage);
}

function findProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

export function buildSituationSummary(answers: QuestionnaireAnswers): string {
  const parts: string[] = [];

  if (answers.dueDate === "already-born") {
    parts.push("Bebé ya nacido");
  } else {
    const due = new Date(answers.dueDate);
    const now = new Date();
    const diffMonths = Math.max(0, Math.round((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    parts.push(diffMonths <= 1 ? "Bebé en camino" : `Bebé en ${diffMonths} meses`);
  }

  const housingLabels: Record<string, string> = {
    "small-apartment": "Apartamento pequeño",
    spacious: "Casa/piso amplio",
    "no-elevator": "Sin ascensor",
  };
  parts.push(housingLabels[answers.housing] || "");

  if (answers.existingEquipment === "nothing") parts.push("Empezando de cero");
  else if (answers.existingEquipment === "some") parts.push("Con algo de equipo");

  return parts.filter(Boolean).join(" · ");
}

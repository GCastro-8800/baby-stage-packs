import { Product, PRODUCT_CATALOG } from "./productCatalog";

export interface QuestionnaireAnswers {
  dueDate: string; // ISO date or "already-born"
  housing: "small-apartment" | "spacious" | "no-elevator";
  concerns: string[];
  existingEquipment: "nothing" | "some" | "specific";
}

/**
 * Returns a list of recommended products based on the user's questionnaire answers.
 * Products from stage "4-8" are NOT pre-selected — they'll be shown as suggestions.
 */
export function getRecommendation(answers: QuestionnaireAnswers): Product[] {
  const selected: Product[] = [];

  const wantsBest = answers.concerns.includes("best-quality");
  const budgetTight = answers.concerns.includes("tight-budget");
  const smallSpace = answers.housing === "small-apartment" || answers.housing === "no-elevator";
  const startFromZero = answers.existingEquipment === "nothing";
  const hasSome = answers.existingEquipment === "some";

  // — CARRITO (always recommend one) —
  if (wantsBest && !smallSpace) {
    selected.push(findProduct("bugaboo-fox-5")!);
  } else if (budgetTight) {
    selected.push(findProduct("babyzen-yoyo3")!);
  } else if (smallSpace) {
    selected.push(findProduct("joolz-aer-2")!);
  } else {
    selected.push(findProduct("joolz-aer-2")!);
  }

  // — CUNA —
  if (wantsBest) {
    selected.push(findProduct("stokke-sleepi")!);
  } else {
    selected.push(findProduct("chicco-next2me")!);
  }

  // — PORTEO (mochila o hamaca) —
  if (startFromZero) {
    if (wantsBest) {
      selected.push(findProduct("hamaca-nuna-leaf")!);
    } else if (budgetTight) {
      selected.push(findProduct("mochila-babybjorn")!);
    } else {
      selected.push(findProduct("mochila-ergobaby")!);
    }
  } else if (!hasSome) {
    // "specific" — skip porteo
  } else {
    selected.push(findProduct("mochila-ergobaby")!);
  }

  // — MONITOR —
  if (startFromZero || !hasSome) {
    if (wantsBest) {
      selected.push(findProduct("monitor-premium")!);
    } else {
      selected.push(findProduct("monitor-basico")!);
    }
  }

  // — CAMBIADOR (only if starting from zero) —
  if (startFromZero) {
    selected.push(findProduct("cambiador")!);
  }

  return selected.filter(Boolean);
}

/**
 * Returns products that should be SHOWN but NOT selected (stage 4-8 suggestions).
 */
export function getStageSuggestions(): Product[] {
  return PRODUCT_CATALOG.filter((p) => p.stage === "4-8");
}

function findProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

/**
 * Build a short summary of the user's situation for display.
 */
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

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
    selected.push(findProduct("bugaboo-fox-3")!);
  } else if (budgetTight) {
    selected.push(findProduct("babyzen-yoyo2")!);
  } else if (smallSpace) {
    selected.push(findProduct("joolz-aer-2")!);
  } else {
    selected.push(findProduct("joolz-aer-2")!);
  }

  // — CUNA —
  if (wantsBest) {
    selected.push(findProduct("stokke-sleepi-mini")!);
  } else {
    selected.push(findProduct("moises-mimbre")!);
  }

  // — PORTEO —
  if (startFromZero) {
    if (wantsBest) {
      selected.push(findProduct("nuna-leaf-grow")!);
    } else if (budgetTight) {
      selected.push(findProduct("ergobaby-omni")!);
    } else {
      selected.push(findProduct("ergobaby-omni")!);
    }
  } else if (!hasSome) {
    // "specific" — skip
  } else {
    selected.push(findProduct("ergobaby-omni")!);
  }

  // — CAMBIADOR (only if starting from zero) —
  if (startFromZero) {
    selected.push(findProduct("cambiador")!);
  }

  return selected.filter(Boolean);
}

export function getStageSuggestions(): Product[] {
  return PRODUCT_CATALOG.filter((p) => p.stage === "4-8");
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

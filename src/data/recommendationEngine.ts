import { Product, PRODUCT_CATALOG } from "./productCatalog";

export interface QuestionnaireAnswers {
  dueDate: string;
  housing: "small-apartment" | "spacious" | "no-elevator";
  concerns: string[];
  existingEquipment: "nothing" | "some" | "specific";
}

export interface RecommendationResult {
  product: Product;
  reasons: string[];
  matchedAnswers: string[];
}

function findProduct(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((p) => p.id === id);
}

function pushIf(
  results: RecommendationResult[],
  productId: string,
  reasons: string[],
  matchedAnswers: string[]
) {
  const product = findProduct(productId);
  if (product) {
    results.push({ product, reasons, matchedAnswers });
  }
}

export function getRecommendationDetailed(answers: QuestionnaireAnswers): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  const wantsBest = answers.concerns.includes("best-quality");
  const budgetTight = answers.concerns.includes("tight-budget");
  const noClutter = answers.concerns.includes("no-clutter");
  const smallSpace = answers.housing === "small-apartment" || answers.housing === "no-elevator";
  const noElevator = answers.housing === "no-elevator";
  const startFromZero = answers.existingEquipment === "nothing";
  const hasSome = answers.existingEquipment === "some";

  // — CARRITO —
  if (wantsBest && !smallSpace) {
    pushIf(
      results,
      "bugaboo-fox-3",
      [
        "Buscas máxima calidad sin investigar",
        "Tienes espacio en casa para un carrito completo",
      ],
      ["concerns:best-quality", `housing:${answers.housing}`]
    );
  } else if (budgetTight || smallSpace) {
    pushIf(
      results,
      "babyzen-yoyo3",
      [
        noElevator ? "Plegado ultra-compacto, perfecto sin ascensor" : "Ocupa muy poco espacio en casa",
        budgetTight ? "Mejor relación calidad/precio" : "Ideal para apartamentos pequeños",
      ],
      [`housing:${answers.housing}`, ...(budgetTight ? ["concerns:tight-budget"] : [])]
    );
  } else {
    pushIf(
      results,
      "joolz-aer-2",
      [
        "Equilibrio entre ligereza y confort",
        "Buena opción versátil para uso diario",
      ],
      [`housing:${answers.housing}`]
    );
  }

  // — CUNA —
  if (wantsBest) {
    pushIf(
      results,
      "stokke-sleepi-mini",
      ["Cuna premium que crece con el bebé", "Diseño que dura años"],
      ["concerns:best-quality"]
    );
  } else {
    pushIf(
      results,
      "moises-mimbre",
      [
        smallSpace ? "Compacto y portátil, ideal para espacios reducidos" : "Acogedor para los primeros meses",
        noClutter ? "Sin acumular muebles grandes" : "Solución ligera para empezar",
      ],
      [`housing:${answers.housing}`, ...(noClutter ? ["concerns:no-clutter"] : [])]
    );
  }

  // — PORTEO —
  if (startFromZero) {
    if (wantsBest) {
      pushIf(
        results,
        "nuna-leaf-grow",
        ["Hamaca premium para empezar de cero", "Calma al bebé desde el día uno"],
        ["existingEquipment:nothing", "concerns:best-quality"]
      );
    } else {
      pushIf(
        results,
        "ergobaby-omni",
        [
          "Mochila ergonómica desde recién nacido",
          "Indispensable si empiezas sin nada",
        ],
        ["existingEquipment:nothing"]
      );
    }
  } else if (hasSome) {
    pushIf(
      results,
      "ergobaby-omni",
      ["Complementa lo que ya tienes", "Porteo cómodo para paseos largos"],
      ["existingEquipment:some"]
    );
  }
  // "specific" → no porteo recommendation

  // — CAMBIADOR (only if starting from zero) —
  if (startFromZero) {
    pushIf(
      results,
      "cambiador",
      ["Básico imprescindible para empezar de cero"],
      ["existingEquipment:nothing"]
    );
  }

  return results;
}

// Backwards-compatible API
export function getRecommendation(answers: QuestionnaireAnswers): Product[] {
  return getRecommendationDetailed(answers).map((r) => r.product);
}

export function getStageSuggestions(stage?: string): Product[] {
  if (!stage) return [];
  return PRODUCT_CATALOG.filter((p) => p.stage === stage);
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

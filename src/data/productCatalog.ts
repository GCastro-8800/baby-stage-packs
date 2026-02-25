export type ProductCategory = "movilidad" | "descanso" | "porteo" | "alimentacion" | "extras";
export type ProductStage = "0-4" | "4-8" | "8-12" | "12-24" | "ambas";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  stage: ProductStage;
  pricePerMonth: number;
  description: string;
  shortReason?: string;
  image?: string;
}

export const PRODUCT_CATALOG: Product[] = [
  // === MOVILIDAD (5) ===
  {
    id: "bugaboo-fox-3",
    name: "Bugaboo Fox 3",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 99,
    description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.",
    shortReason: "Máxima calidad y confort",
  },
  {
    id: "bugaboo-donkey-3",
    name: "Bugaboo Donkey 3",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 109,
    description: "Carrito extensible de mono a dúo. Ideal para familias que crecen.",
    shortReason: "Extensible mono/dúo",
  },
  {
    id: "bugaboo-dragonfly",
    name: "Bugaboo Dragonfly",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 99,
    description: "Carrito ultraligero y compacto de Bugaboo, ideal para ciudad.",
    shortReason: "Ligero con sello Bugaboo",
  },
  {
    id: "joolz-aer-2",
    name: "Joolz Aer 2",
    brand: "Joolz",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 79,
    description: "Carrito urbano ultraligero con plegado compacto. Solo 6 kg.",
    shortReason: "Ultraligero (6 kg)",
  },
  {
    id: "babyzen-yoyo2",
    name: "Babyzen YOYO2",
    brand: "Babyzen",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 69,
    description: "El carrito compacto por excelencia. Cabe en equipaje de mano.",
    shortReason: "El más compacto y económico",
  },

  // === DESCANSO (2) ===
  {
    id: "stokke-sleepi-mini",
    name: "Stokke Sleepi Mini",
    brand: "Stokke",
    category: "descanso",
    stage: "0-4",
    pricePerMonth: 75,
    description: "Minicuna ovalada en madera de haya. Diseño escandinavo que envuelve al bebé.",
    shortReason: "Diseño escandinavo premium",
  },
  {
    id: "moises-mimbre",
    name: "Moisés de mimbre",
    brand: "Bebloo",
    category: "descanso",
    stage: "0-4",
    pricePerMonth: 25,
    description: "Moisés artesanal de mimbre natural con colchón incluido. Ligero y transportable.",
    shortReason: "Clásico y acogedor",
  },

  // === ALIMENTACIÓN (2) ===
  {
    id: "trona-stokke-tripp-trapp",
    name: "Stokke Tripp Trapp",
    brand: "Stokke",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 39,
    description: "La trona icónica en madera. Crece con el niño hasta adulto.",
    shortReason: "Icónica y evolutiva",
  },
  {
    id: "trona-bugaboo-giraffe",
    name: "Bugaboo Giraffe",
    brand: "Bugaboo",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 39,
    description: "Trona evolutiva de diseño con ajuste en altura.",
    shortReason: "Diseño Bugaboo premium",
  },

  // === PORTEO Y CONFORT (7) ===
  {
    id: "babybjorn-bliss",
    name: "BabyBjörn Bliss/Balance",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 22,
    description: "Hamaca con balanceo natural y tres posiciones. Tejido suave y transpirable.",
    shortReason: "Clásica y fiable",
  },
  {
    id: "bugaboo-giraffe-hamaca",
    name: "Bugaboo Giraffe Hamaca",
    brand: "Bugaboo",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 35,
    description: "Set de hamaca para la silla Bugaboo Giraffe. Uso desde recién nacido.",
    shortReason: "Diseño Bugaboo integrado",
  },
  {
    id: "nuna-leaf-grow",
    name: "Nuna LEAF Grow",
    brand: "Nuna",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 55,
    description: "Hamaca evolutiva con balanceo natural. Crece desde recién nacido hasta 60 kg.",
    shortReason: "Hamaca que crece con tu hijo",
  },
  {
    id: "babybjorn-balance-soft",
    name: "BabyBjörn Balance Soft",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 25,
    description: "Hamaca ergonómica con asiento envolvente de algodón/jersey. Diseño suave y natural.",
    shortReason: "Máximo confort ergonómico",
  },
  {
    id: "babybjorn-harmony",
    name: "BabyBjörn Harmony",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 29,
    description: "Mochila portabebé premium con soporte lumbar acolchado y malla transpirable.",
    shortReason: "Porteo premium y ergonómico",
  },
  {
    id: "ergobaby-omni",
    name: "Ergobaby Omni",
    brand: "Ergobaby",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 22,
    description: "Mochila portabebé con malla transpirable SoftFlex. Todas las posiciones desde recién nacido.",
    shortReason: "Ergonómica y versátil",
  },
  {
    id: "boba-wrap",
    name: "Boba Wrap",
    brand: "Boba",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 12,
    description: "Fular elástico de algodón orgánico. Contacto piel con piel desde el nacimiento.",
    shortReason: "Porteo natural desde el día 1",
  },

  // === EXTRAS (1) ===
  {
    id: "cambiador",
    name: "Cambiador de mimbre",
    brand: "Bebloo",
    category: "extras",
    stage: "0-4",
    pricePerMonth: 9,
    description: "Cambiador artesanal de mimbre natural. Práctico y elegante.",
    shortReason: "Artesanal y funcional",
  },
];

export const getProductById = (id: string): Product | undefined =>
  PRODUCT_CATALOG.find((p) => p.id === id);

export const getProductsByCategory = (category: ProductCategory): Product[] =>
  PRODUCT_CATALOG.filter((p) => p.category === category);

export const getProductsByStage = (stage: ProductStage): Product[] =>
  PRODUCT_CATALOG.filter((p) => p.stage === stage || p.stage === "ambas");

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  movilidad: "Movilidad",
  descanso: "Descanso",
  porteo: "Porteo y confort",
  alimentacion: "Alimentación",
  extras: "Básicos y extras",
};

export const STAGE_LABELS: Record<string, string> = {
  "0-4": "Etapa 0–4 meses",
  "4-8": "Etapa 4–8 meses",
  "8-12": "Etapa 8–12 meses",
  "12-24": "Etapa 12–24 meses",
};

export const ALL_STAGES = ["0-4", "4-8", "8-12", "12-24"] as const;

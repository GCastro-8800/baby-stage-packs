export type ProductCategory = "movilidad" | "descanso" | "porteo" | "alimentacion" | "extras";
export type ProductStage = "0-4" | "4-8" | "ambas";

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
  // MOVILIDAD
  {
    id: "bugaboo-fox-5",
    name: "Bugaboo Fox 5",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 99,
    description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.",
    shortReason: "Máxima calidad y confort",
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
    id: "babyzen-yoyo3",
    name: "Babyzen YOYO3",
    brand: "Babyzen",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 69,
    description: "El carrito compacto por excelencia. Cabe en equipaje de mano.",
    shortReason: "El más compacto y económico",
  },

  // DESCANSO
  {
    id: "stokke-sleepi",
    name: "Stokke Sleepi",
    brand: "Stokke",
    category: "descanso",
    stage: "ambas",
    pricePerMonth: 75,
    description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya.",
    shortReason: "Crece con tu bebé",
  },
  {
    id: "chicco-next2me",
    name: "Chicco Next2Me",
    brand: "Chicco",
    category: "descanso",
    stage: "0-4",
    pricePerMonth: 29,
    description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres.",
    shortReason: "Colecho seguro y accesible",
  },

  // PORTEO
  {
    id: "hamaca-nuna-leaf",
    name: "Hamaca Nuna LEAF",
    brand: "Nuna",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 49,
    description: "Hamaca de balanceo silencioso que crece con el bebé. Diseño premium.",
    shortReason: "Balanceo silencioso premium",
  },
  {
    id: "hamaca-babybjorn",
    name: "Hamaca BabyBjörn",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 19,
    description: "Hamaca con balanceo natural. Tejido suave y transpirable.",
    shortReason: "Clásica y fiable",
  },
  {
    id: "mochila-ergobaby",
    name: "Mochila Ergobaby",
    brand: "Ergobaby",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 22,
    description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido.",
    shortReason: "Ergonómica y versátil",
  },
  {
    id: "mochila-babybjorn",
    name: "Mochila BabyBjörn",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 15,
    description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años.",
    shortReason: "Económica y cómoda",
  },

  // ALIMENTACIÓN
  {
    id: "trona-bugaboo-giraffe",
    name: "Trona Bugaboo Giraffe",
    brand: "Bugaboo",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 39,
    description: "Trona evolutiva de diseño con ajuste en altura.",
    shortReason: "Diseño Bugaboo premium",
  },
  {
    id: "trona-stokke-tripp-trapp",
    name: "Trona Stokke Tripp Trapp",
    brand: "Stokke",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 34,
    description: "La trona de referencia. Crece con el niño hasta adulto.",
    shortReason: "La más icónica y duradera",
  },

  // EXTRAS
  {
    id: "monitor-premium",
    name: "Monitor premium",
    brand: "Angelcare",
    category: "extras",
    stage: "0-4",
    pricePerMonth: 17,
    description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad.",
    shortReason: "Con sensor de movimiento",
  },
  {
    id: "monitor-basico",
    name: "Monitor básico",
    brand: "Bebloo",
    category: "extras",
    stage: "0-4",
    pricePerMonth: 9,
    description: "Monitor con cámara HD para vigilar al bebé día y noche.",
    shortReason: "Vigilancia esencial",
  },
  {
    id: "alfombra-toddlekind",
    name: "Alfombra Toddlekind",
    brand: "Toddlekind",
    category: "extras",
    stage: "4-8",
    pricePerMonth: 25,
    description: "Alfombra de juegos de diseño, suave y fácil de limpiar.",
    shortReason: "Diseño + funcionalidad",
  },
  {
    id: "cambiador",
    name: "Cambiador",
    brand: "Leander",
    category: "extras",
    stage: "0-4",
    pricePerMonth: 9,
    description: "Cambiador ergonómico con diseño danés premium.",
    shortReason: "Ergonómico y elegante",
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
};

import type { EquipmentOption, EquipmentCategory } from "./planEquipment";

export interface PackStage {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  products: EquipmentCategory[];
}

export interface PackConfig {
  id: string;
  name: string;
  price: number; // Reference/marketing price — actual total varies by brand selection
  serviceFee: number; // Monthly service fee for the tier (premium services, personal manager, etc.)
  tagline: string;
  stages: PackStage[];
}

/* ──────────────────────────────────────────────
   Shared product option builders (DRY helpers)
   ────────────────────────────────────────────── */

// Comfort-tier options per category
const comfortCunas: EquipmentOption[] = [
  { brand: "Chicco", model: "Next2Me", precio_en_pack: 38.00, precio_individual: 114.00, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
  { brand: "Stokke", model: "Sleepi V3", precio_en_pack: 55.00, precio_individual: 165.00, description: "Cuna ovalada evolutiva que crece con el bebé. Diseño escandinavo en madera de haya." },
  { brand: "Artesanal", model: "Moisés de mimbre", precio_en_pack: 45.00, precio_individual: 135.00, description: "Moisés clásico de mimbre natural. Acogedor y transpirable para los primeros meses." },
];

const comfortMonitor: EquipmentOption[] = [
  { brand: "Premium", model: "Monitor con cámara", precio_en_pack: 13.70, precio_individual: 41.10, description: "Monitor con cámara HD para vigilar al bebé día y noche. Máxima tranquilidad." },
];

const comfortCambiadores: EquipmentOption[] = [
  { brand: "Artesanal", model: "Cesto mimbre", precio_en_pack: 9.50, precio_individual: 28.50, description: "Cambiador de mimbre natural, funcional y decorativo." },
  { brand: "Zara Home", model: "Cambiador", precio_en_pack: 11.00, precio_individual: 33.00, description: "Cambiador de diseño elegante y minimalista." },
  { brand: "Leander", model: "Matty", precio_en_pack: 14.88, precio_individual: 44.64, description: "Cambiador ergonómico con diseño danés premium." },
];

const comfortCarritos: EquipmentOption[] = [
  { brand: "Bugaboo", model: "Fox 5", precio_en_pack: 37.68, precio_individual: 113.04, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
  { brand: "Bugaboo", model: "Donkey 5", precio_en_pack: 40.50, precio_individual: 121.50, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
  { brand: "Bugaboo", model: "Dragonfly", precio_en_pack: 35.31, precio_individual: 105.93, description: "Carrito ultraligero y compacto, ideal para ciudad." },
  { brand: "Joolz", model: "Aer 2", precio_en_pack: 28.02, precio_individual: 84.06, description: "Silla de paseo ultraligera con plegado compacto." },
  { brand: "Babyzen", model: "YOYO 3", precio_en_pack: 25.43, precio_individual: 76.29, description: "El carrito más compacto del mercado. Homologado como equipaje de mano." },
];

const comfortHamacas: EquipmentOption[] = [
  { brand: "BabyBjörn", model: "Bliss", precio_en_pack: 17.56, precio_individual: 52.68, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
  { brand: "BabyBjörn", model: "Balance Soft", precio_en_pack: 16.20, precio_individual: 48.60, description: "Hamaca ergonómica con asiento acolchado y balanceo suave." },
  { brand: "Bugaboo", model: "Giraffe hamaca", precio_en_pack: 18.96, precio_individual: 56.88, description: "Hamaca ergonómica compatible con trona Giraffe." },
  { brand: "Nuna", model: "LEAF Grow", precio_en_pack: 20.50, precio_individual: 61.50, description: "Hamaca de balanceo silencioso que crece con el bebé." },
];

const comfortPorteo: EquipmentOption[] = [
  { brand: "BabyBjörn", model: "One", precio_en_pack: 14.50, precio_individual: 43.50, description: "Portabebé ergonómico con múltiples posiciones. De 0 a 3 años." },
  { brand: "BabyBjörn", model: "One Air", precio_en_pack: 16.80, precio_individual: 50.40, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
  { brand: "Ergobaby", model: "Omni Breeze", precio_en_pack: 15.25, precio_individual: 45.75, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
  { brand: "Boba", model: "Wrap", precio_en_pack: 12.33, precio_individual: 36.99, description: "Fular portabebé elástico, ideal para recién nacidos." },
];

const comfortTronas: EquipmentOption[] = [
  { brand: "Stokke", model: "Tripp Trapp", precio_en_pack: 21.91, precio_individual: 65.73, description: "La trona de referencia. Crece con el niño hasta adulto." },
  { brand: "Bugaboo", model: "Giraffe trona", precio_en_pack: 18.96, precio_individual: 56.88, description: "Trona evolutiva de diseño con ajuste en altura." },
];

const comfortAlfombras: EquipmentOption[] = [
  { brand: "Toddlekind", model: "Alfombra premium", precio_en_pack: 18.21, precio_individual: 54.63, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
  { brand: "Skip Hop", model: "Playspot Geo", precio_en_pack: 14.90, precio_individual: 44.70, description: "Alfombra de espuma con piezas encajables de diseño geométrico." },
  { brand: "Totter & Tumble", model: "Alfombra reversible", precio_en_pack: 16.65, precio_individual: 49.95, description: "Alfombra de juegos reversible con diseños elegantes." },
];

/* ──────────────────────────────────────────────
   Total Peace premium extras (on top of Comfort)
   ────────────────────────────────────────────── */

const tpCunaExtra: EquipmentOption = {
  brand: "Stokke", model: "Sleepi Mini", precio_en_pack: 60.00, precio_individual: 180.00, description: "Minicuna ovalada premium que crece con el bebé. Diseño escandinavo en madera de haya.",
};

const tpMonitorExtra: EquipmentOption = {
  brand: "Angelcare", model: "Monitor premium", precio_en_pack: 17.95, precio_individual: 53.85, description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad.",
};

const tpCambiadorExtra: EquipmentOption = {
  brand: "Leander", model: "Matty Premium", precio_en_pack: 16.50, precio_individual: 49.50, description: "Cambiador ergonómico premium con diseño danés y acabados superiores.",
};

const tpCarritoExtra: EquipmentOption = {
  brand: "Bugaboo", model: "Donkey 5 Duo", precio_en_pack: 45.90, precio_individual: 137.70, description: "Configuración Duo completa del Donkey 5. Máximo espacio y versatilidad.",
};

const tpHamacaExtra: EquipmentOption = {
  brand: "Nuna", model: "LEAF Curv", precio_en_pack: 25.50, precio_individual: 76.50, description: "Hamaca de balanceo silencioso premium con diseño curvo único.",
};

const tpPorteoExtra: EquipmentOption = {
  brand: "BabyBjörn", model: "Harmony", precio_en_pack: 19.80, precio_individual: 59.40, description: "Portabebé premium con malla 3D ultrasuave y soporte lumbar reforzado.",
};

const tpTronaExtra: EquipmentOption = {
  brand: "Stokke", model: "Tripp Trapp Oak", precio_en_pack: 25.50, precio_individual: 76.50, description: "Trona Tripp Trapp en madera de roble premium. Edición exclusiva.",
};

const tpAlfombraExtra: EquipmentOption = {
  brand: "Toddlekind", model: "Persian Collection", precio_en_pack: 22.50, precio_individual: 67.50, description: "Alfombra de juegos colección Persian. Diseño exclusivo premium.",
};

/* ──────────────────────────────────────────────
   Pack configurations
   ────────────────────────────────────────────── */

export const packStages: Record<string, PackConfig> = {
  start: {
    id: "start",
    name: "BEBLOO Start",
    price: 79,
    serviceFee: 0,
    tagline: "Lo esencial para empezar con tranquilidad",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Todo lo que necesitas tener listo antes de que llegue el bebé.",
        products: [
          {
            category: "Cuna",
            type: "fixed",
            options: [
              { brand: "Chicco", model: "Next2Me", precio_en_pack: 31.58, precio_individual: 94.74, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
            ],
          },
          {
            category: "Cambiador",
            type: "fixed",
            options: [
              { brand: "Bebloo", model: "Cambiador portátil", precio_en_pack: 16.38, precio_individual: 49.14, description: "Cambiador portátil funcional y ligero. Acompaña todo el ciclo." },
            ],
          },
          {
            category: "Monitor",
            type: "fixed",
            options: [
              { brand: "Bebloo", model: "Monitor bebé solo audio", precio_en_pack: 15.51, precio_individual: 46.53, description: "Monitor de audio para vigilar al bebé. Acompaña todo el ciclo." },
            ],
          },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–12 meses",
        description: "El carrito para los paseos y el día a día con tu bebé.",
        products: [
          {
            category: "Carrito",
            type: "fixed",
            options: [
              { brand: "Chicco", model: "Lite Way", precio_en_pack: 15.63, precio_individual: 46.89, description: "Carrito ligero y compacto, ideal para ciudad." },
            ],
          },
        ],
      },
    ],
  },

  comfort: {
    id: "comfort",
    name: "BEBLOO Comfort",
    price: 169,
    serviceFee: 0,
    tagline: "Todo el equipamiento esencial, entregado por etapas",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Prepara la habitación del bebé con todo lo necesario antes de su llegada.",
        products: [
          { category: "Cuna", type: "choice", options: comfortCunas },
          { category: "Monitor", type: "fixed", options: comfortMonitor },
          { category: "Cambiador", type: "choice", options: comfortCambiadores },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–6 meses",
        description: "Carrito, hamaca y portabebé para los primeros paseos y el día a día.",
        products: [
          { category: "Carrito", type: "choice", options: comfortCarritos },
          { category: "Hamaca", type: "choice", options: comfortHamacas },
          { category: "Mochila portabebé", type: "choice", options: comfortPorteo },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Tu bebé empieza a sentarse, gatear y comer solo. Nuevo equipamiento adaptado.",
        products: [
          { category: "Trona", type: "choice", options: comfortTronas },
          { category: "Alfombra de juego", type: "choice", options: comfortAlfombras },
        ],
      },
    ],
  },

  "total-peace": {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 199,
    serviceFee: 30,
    tagline: "Todo lo de Comfort + máxima delegación y personalización",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Todo preparado antes de la llegada, con opciones premium y asesoramiento personal.",
        products: [
          { category: "Cuna", type: "choice", options: [...comfortCunas, tpCunaExtra] },
          { category: "Monitor", type: "choice", options: [...comfortMonitor, tpMonitorExtra] },
          { category: "Cambiador", type: "choice", options: [...comfortCambiadores, tpCambiadorExtra] },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–6 meses",
        description: "El equipamiento completo para paseos, descanso y porteo, con asesoramiento continuo.",
        products: [
          { category: "Carrito", type: "choice", options: [...comfortCarritos, tpCarritoExtra] },
          { category: "Hamaca", type: "choice", options: [...comfortHamacas, tpHamacaExtra] },
          { category: "Porteo", type: "choice", options: [...comfortPorteo, tpPorteoExtra] },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Trona y alfombra de juegos para la nueva etapa de independencia.",
        products: [
          { category: "Trona", type: "choice", options: [...comfortTronas, tpTronaExtra] },
          { category: "Alfombra de juegos", type: "choice", options: [...comfortAlfombras, tpAlfombraExtra] },
        ],
      },
    ],
  },
};

export const getPackConfig = (packId: string): PackConfig | undefined =>
  packStages[packId];

export const getPackStage = (packId: string, stageId: string): PackStage | undefined =>
  packStages[packId]?.stages.find((s) => s.id === stageId);

export const getTotalProductCount = (packId: string): number => {
  const pack = packStages[packId];
  if (!pack) return 0;
  return pack.stages.reduce(
    (sum, stage) => sum + stage.products.length,
    0
  );
};

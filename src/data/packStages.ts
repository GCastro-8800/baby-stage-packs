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
  price: number;
  tagline: string;
  stages: PackStage[];
}

export const packStages: Record<string, PackConfig> = {
  start: {
    id: "start",
    name: "BEBLOO Start",
    price: 79,
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
              { brand: "Chicco", model: "Next2Me", coste_real_mes: 15.91, precio_individual: 54.77, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
            ],
          },
          {
            category: "Cambiador",
            type: "fixed",
            options: [
              { brand: "Bebloo", model: "Cambiador portátil", coste_real_mes: 6.96, precio_individual: 32.40, description: "Cambiador portátil funcional y ligero." },
            ],
          },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–6 meses",
        description: "El equipamiento para los paseos y el día a día con un recién nacido.",
        products: [
          {
            category: "Carrito",
            type: "choice",
            options: [
              { brand: "Chicco", model: "Lite Way", coste_real_mes: 8.83, precio_individual: 37.08, description: "Carrito ligero y compacto, ideal para ciudad." },
              { brand: "Joolz", model: "Aer 2", coste_real_mes: 18.50, precio_individual: 61.25, description: "Carrito urbano ultraligero con plegado compacto." },
              { brand: "Babyzen", model: "YOYO3", coste_real_mes: 16.79, precio_individual: 56.97, description: "El carrito compacto por excelencia. Cabe en equipaje de mano." },
            ],
          },
          {
            category: "Hamaca",
            type: "fixed",
            options: [
              { brand: "Fisher Price", model: "Hamaca básica", coste_real_mes: 9.66, precio_individual: 39.15, description: "Hamaca con balanceo natural, cómoda y segura." },
            ],
          },
          {
            category: "Porteo",
            type: "choice",
            options: [
              { brand: "Boba", model: "Wrap", coste_real_mes: 9.25, precio_individual: 38.12, description: "Fular portabebé elástico, ideal para recién nacidos." },
            ],
          },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Tu bebé crece y necesita nuevo equipamiento adaptado.",
        products: [
          {
            category: "Trona",
            type: "fixed",
            options: [
              { brand: "Chicco", model: "Trona básica", coste_real_mes: 10.77, precio_individual: 41.92, description: "Trona funcional y ajustable en altura." },
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
    tagline: "Todo el equipamiento esencial, entregado por etapas",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Prepara la habitación del bebé con todo lo necesario antes de su llegada.",
        products: [
          {
            category: "Cuna",
            type: "fixed",
            options: [
              { brand: "Stokke", model: "Sleepi Mini", coste_real_mes: 32.67, precio_individual: 96.68, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
            ],
          },
          {
            category: "Cambiador",
            type: "fixed",
            options: [
              { brand: "Leander", model: "Matty", coste_real_mes: 11.17, precio_individual: 42.92, description: "Cambiador ergonómico con diseño danés premium." },
            ],
          },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–6 meses",
        description: "Carrito, hamaca y portabebé para los primeros paseos y el día a día.",
        products: [
          {
            category: "Carrito",
            type: "choice",
            options: [
              { brand: "Bugaboo", model: "Fox 5", coste_real_mes: 28.25, precio_individual: 85.62, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
              { brand: "Bugaboo", model: "Dragonfly", coste_real_mes: 26.50, precio_individual: 81.25, description: "Carrito ultraligero y compacto, ideal para ciudad." },
            ],
          },
          {
            category: "Hamaca",
            type: "choice",
            options: [
              { brand: "BabyBjörn", model: "Bliss", coste_real_mes: 13.17, precio_individual: 47.92, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
              { brand: "Bugaboo", model: "Giraffe hamaca", coste_real_mes: 14.22, precio_individual: 50.55, description: "Hamaca ergonómica compatible con trona Giraffe." },
            ],
          },
          {
            category: "Porteo",
            type: "choice",
            options: [
              { brand: "Ergobaby", model: "Omni Breeze", coste_real_mes: 11.44, precio_individual: 43.60, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
              { brand: "Boba", model: "Wrap", coste_real_mes: 9.25, precio_individual: 38.12, description: "Fular portabebé elástico, ideal para recién nacidos." },
            ],
          },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Tu bebé empieza a sentarse, gatear y comer solo. Nuevo equipamiento adaptado.",
        products: [
          {
            category: "Trona",
            type: "choice",
            options: [
              { brand: "Stokke", model: "Tripp Trapp", coste_real_mes: 16.44, precio_individual: 56.10, description: "La trona de referencia. Crece con el niño hasta adulto." },
              { brand: "Bugaboo", model: "Giraffe trona", coste_real_mes: 14.22, precio_individual: 50.55, description: "Trona evolutiva de diseño con ajuste en altura." },
            ],
          },
          {
            category: "Alfombra de juegos",
            type: "choice",
            options: [
              { brand: "Toddlekind", model: "Alfombra premium", coste_real_mes: 13.67, precio_individual: 49.17, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
              { brand: "Totter & Tumble", model: "Alfombra reversible", coste_real_mes: 12.50, precio_individual: 46.25, description: "Alfombra de juegos reversible con diseños elegantes." },
            ],
          },
        ],
      },
    ],
  },
  "total-peace": {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 199,
    tagline: "Todo lo de Comfort + máxima delegación y personalización",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Todo preparado antes de la llegada, con opciones premium y asesoramiento personal.",
        products: [
          {
            category: "Cuna",
            type: "fixed",
            options: [
              { brand: "Stokke", model: "Sleepi Mini", coste_real_mes: 32.67, precio_individual: 96.68, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
            ],
          },
          {
            category: "Cambiador",
            type: "fixed",
            options: [
              { brand: "Leander", model: "Matty", coste_real_mes: 11.17, precio_individual: 42.92, description: "Cambiador ergonómico con diseño danés premium." },
            ],
          },
          {
            category: "Monitor",
            type: "fixed",
            options: [
              { brand: "Angelcare", model: "Monitor premium", coste_real_mes: 15.00, precio_individual: 52.50, description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad." },
            ],
          },
        ],
      },
      {
        id: "etapa-1",
        name: "Etapa 1 — Primeros meses",
        subtitle: "0–6 meses",
        description: "El equipamiento completo para paseos, descanso y porteo, con asesoramiento continuo.",
        products: [
          {
            category: "Carrito",
            type: "choice",
            options: [
              { brand: "Bugaboo", model: "Donkey 5", coste_real_mes: 30.00, precio_individual: 90.00, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
              { brand: "Bugaboo", model: "Dragonfly", coste_real_mes: 26.50, precio_individual: 81.25, description: "Carrito ultraligero y compacto, ideal para ciudad." },
            ],
          },
          {
            category: "Hamaca",
            type: "fixed",
            options: [
              { brand: "Nuna", model: "LEAF Grow", coste_real_mes: 25.67, precio_individual: 79.18, description: "Hamaca de balanceo silencioso que crece con el bebé." },
            ],
          },
          {
            category: "Porteo",
            type: "fixed",
            options: [
              { brand: "BabyBjörn", model: "One Air", coste_real_mes: 11.44, precio_individual: 43.60, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
            ],
          },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Trona y alfombra de juegos para la nueva etapa de independencia.",
        products: [
          {
            category: "Trona",
            type: "fixed",
            options: [
              { brand: "Stokke", model: "Tripp Trapp", coste_real_mes: 16.44, precio_individual: 56.10, description: "La trona de referencia. Crece con el niño hasta adulto." },
            ],
          },
          {
            category: "Alfombra de juegos",
            type: "fixed",
            options: [
              { brand: "Toddlekind", model: "Alfombra premium", coste_real_mes: 13.67, precio_individual: 49.17, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
            ],
          },
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

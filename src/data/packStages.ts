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
            type: "choice",
            options: [
              { brand: "Chicco", model: "Next2Me", precio_en_pack: 50.70, precio_individual: 152.10, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
              { brand: "Stokke", model: "Sleepi V3", precio_en_pack: 50.70, precio_individual: 152.10, description: "Cuna ovalada evolutiva que crece con el bebé. Diseño escandinavo en madera de haya." },
              { brand: "Artesanal", model: "Moisés de mimbre", precio_en_pack: 50.70, precio_individual: 152.10, description: "Moisés clásico de mimbre natural. Acogedor y transpirable para los primeros meses." },
            ],
          },
          {
            category: "Monitor",
            type: "fixed",
            options: [
              { brand: "Premium", model: "Monitor con cámara", precio_en_pack: 13.70, precio_individual: 41.10, description: "Monitor con cámara HD para vigilar al bebé día y noche. Máxima tranquilidad." },
            ],
          },
          {
            category: "Cambiador",
            type: "choice",
            options: [
              { brand: "Artesanal", model: "Cesto mimbre", precio_en_pack: 11.32, precio_individual: 33.96, description: "Cambiador de mimbre natural, funcional y decorativo." },
              { brand: "Zara Home", model: "Cambiador", precio_en_pack: 11.32, precio_individual: 33.96, description: "Cambiador de diseño elegante y minimalista." },
              { brand: "Leander", model: "Matty", precio_en_pack: 11.32, precio_individual: 33.96, description: "Cambiador ergonómico con diseño danés premium." },
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
              { brand: "Bugaboo", model: "Fox 5", precio_en_pack: 29.49, precio_individual: 88.47, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
              { brand: "Bugaboo", model: "Donkey 5", precio_en_pack: 29.49, precio_individual: 88.47, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
              { brand: "Bugaboo", model: "Dragonfly", precio_en_pack: 29.49, precio_individual: 88.47, description: "Carrito ultraligero y compacto, ideal para ciudad." },
              { brand: "Joolz", model: "Aer 2", precio_en_pack: 29.49, precio_individual: 88.47, description: "Silla de paseo ultraligera con plegado compacto." },
              { brand: "Babyzen", model: "YOYO 3", precio_en_pack: 29.49, precio_individual: 88.47, description: "El carrito más compacto del mercado. Homologado como equipaje de mano." },
            ],
          },
          {
            category: "Hamaca",
            type: "choice",
            options: [
              { brand: "BabyBjörn", model: "Bliss", precio_en_pack: 14.83, precio_individual: 44.49, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
              { brand: "BabyBjörn", model: "Balance Soft", precio_en_pack: 14.83, precio_individual: 44.49, description: "Hamaca ergonómica con asiento acolchado y balanceo suave." },
              { brand: "Bugaboo", model: "Giraffe hamaca", precio_en_pack: 14.83, precio_individual: 44.49, description: "Hamaca ergonómica compatible con trona Giraffe." },
              { brand: "Nuna", model: "LEAF Grow", precio_en_pack: 14.83, precio_individual: 44.49, description: "Hamaca de balanceo silencioso que crece con el bebé." },
            ],
          },
          {
            category: "Mochila portabebé",
            type: "choice",
            options: [
              { brand: "BabyBjörn", model: "One", precio_en_pack: 15.34, precio_individual: 46.02, description: "Portabebé ergonómico con múltiples posiciones. De 0 a 3 años." },
              { brand: "BabyBjörn", model: "One Air", precio_en_pack: 15.34, precio_individual: 46.02, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
              { brand: "Ergobaby", model: "Omni Breeze", precio_en_pack: 15.34, precio_individual: 46.02, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
              { brand: "Boba", model: "Wrap", precio_en_pack: 15.34, precio_individual: 46.02, description: "Fular portabebé elástico, ideal para recién nacidos." },
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
              { brand: "Stokke", model: "Tripp Trapp", precio_en_pack: 17.12, precio_individual: 51.36, description: "La trona de referencia. Crece con el niño hasta adulto." },
              { brand: "Bugaboo", model: "Giraffe trona", precio_en_pack: 17.12, precio_individual: 51.36, description: "Trona evolutiva de diseño con ajuste en altura." },
            ],
          },
          {
            category: "Alfombra de juego",
            type: "choice",
            options: [
              { brand: "Toddlekind", model: "Alfombra premium", precio_en_pack: 16.51, precio_individual: 49.53, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
              { brand: "Skip Hop", model: "Playspot Geo", precio_en_pack: 16.51, precio_individual: 49.53, description: "Alfombra de espuma con piezas encajables de diseño geométrico." },
              { brand: "Totter & Tumble", model: "Alfombra reversible", precio_en_pack: 16.51, precio_individual: 49.53, description: "Alfombra de juegos reversible con diseños elegantes." },
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
              { brand: "Stokke", model: "Sleepi Mini", precio_en_pack: 39.09, precio_individual: 117.27, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
            ],
          },
          {
            category: "Cambiador",
            type: "fixed",
            options: [
              { brand: "Leander", model: "Matty", precio_en_pack: 13.36, precio_individual: 40.08, description: "Cambiador ergonómico con diseño danés premium." },
            ],
          },
          {
            category: "Monitor",
            type: "fixed",
            options: [
              { brand: "Angelcare", model: "Monitor premium", precio_en_pack: 17.95, precio_individual: 53.85, description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad." },
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
              { brand: "Bugaboo", model: "Donkey 5", precio_en_pack: 35.90, precio_individual: 107.70, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
              { brand: "Bugaboo", model: "Dragonfly", precio_en_pack: 31.70, precio_individual: 95.10, description: "Carrito ultraligero y compacto, ideal para ciudad." },
            ],
          },
          {
            category: "Hamaca",
            type: "fixed",
            options: [
              { brand: "Nuna", model: "LEAF Grow", precio_en_pack: 30.71, precio_individual: 92.13, description: "Hamaca de balanceo silencioso que crece con el bebé." },
            ],
          },
          {
            category: "Porteo",
            type: "fixed",
            options: [
              { brand: "BabyBjörn", model: "One Air", precio_en_pack: 13.69, precio_individual: 41.07, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
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
              { brand: "Stokke", model: "Tripp Trapp", precio_en_pack: 19.67, precio_individual: 59.01, description: "La trona de referencia. Crece con el niño hasta adulto." },
            ],
          },
          {
            category: "Alfombra de juegos",
            type: "fixed",
            options: [
              { brand: "Toddlekind", model: "Alfombra premium", precio_en_pack: 16.36, precio_individual: 49.08, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
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

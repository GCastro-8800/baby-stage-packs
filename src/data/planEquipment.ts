// CANONICAL PRICE SOURCE — planEquipment.ts is the source of truth for equipment pricing.
// If prices differ in packStages.ts, update packStages.ts to match this file.

export interface EquipmentOption {
  brand: string;
  model: string;
  image?: string;
  description?: string;
  precio_individual?: number;
  precio_en_pack?: number;
}

export interface EquipmentCategory {
  category: string;
  type: "fixed" | "choice";
  options: EquipmentOption[];
}

export interface PlanData {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  guarantee: string;
  equipment: EquipmentCategory[];
  upgradePlanId?: string;
  upgradePlanName?: string;
}

export const plansEquipment: PlanData[] = [
  {
    id: "start",
    name: "BEBLOO Start",
    price: 79,
    duration: "30 días",
    description: "Una opción básica para probar el servicio durante el inicio.",
    guarantee: "30 días. Puedes cancelar y Bebloo recoge el equipamiento.",
    upgradePlanId: "comfort",
    upgradePlanName: "BEBLOO Comfort",
    equipment: [
      {
        category: "Cuna",
        type: "fixed",
        options: [
          { brand: "Chicco", model: "Next2Me", precio_en_pack: 24.10, precio_individual: 72.30, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
        ],
      },
      {
        category: "Cambiador",
        type: "fixed",
        options: [
          { brand: "Bebloo", model: "Cambiador portátil", precio_en_pack: 10.58, precio_individual: 31.74, description: "Cambiador portátil funcional y ligero." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Chicco", model: "Lite Way", precio_en_pack: 13.35, precio_individual: 40.05, description: "Carrito ligero y compacto, ideal para ciudad." },
          { brand: "Joolz", model: "Aer 2", precio_en_pack: 28.02, precio_individual: 84.06, description: "Carrito urbano ultraligero con plegado compacto." },
          { brand: "Babyzen", model: "YOYO3", precio_en_pack: 25.43, precio_individual: 76.29, description: "El carrito compacto por excelencia. Cabe en equipaje de mano." },
        ],
      },
      {
        category: "Hamaca",
        type: "fixed",
        options: [
          { brand: "Fisher Price", model: "Hamaca básica", precio_en_pack: 14.62, precio_individual: 43.86, description: "Hamaca con balanceo natural, cómoda y segura." },
        ],
      },
      {
        category: "Trona",
        type: "fixed",
        options: [
          { brand: "Chicco", model: "Trona básica", precio_en_pack: 16.35, precio_individual: 49.05, description: "Trona funcional y ajustable en altura." },
        ],
      },
      {
        category: "Porteo",
        type: "choice",
        options: [
          { brand: "Boba", model: "Wrap", precio_en_pack: 14.02, precio_individual: 42.06, description: "Fular portabebé elástico, ideal para recién nacidos." },
        ],
      },
    ],
  },
  {
    id: "comfort",
    name: "BEBLOO Comfort",
    price: 169,
    duration: "Sin permanencia",
    description: "Todo el equipamiento esencial, entregado y cambiado por etapas según su crecimiento.",
    guarantee: "60 días. Si no te aporta tranquilidad o reduce tu estrés, cancelas y Bebloo recoge todo sin coste.",
    upgradePlanId: "total-peace",
    upgradePlanName: "BEBLOO Total Peace",
    equipment: [
      {
        category: "Cuna",
        type: "fixed",
        options: [
          { brand: "Stokke", model: "Sleepi Mini", precio_en_pack: 43.56, precio_individual: 130.68, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
        ],
      },
      {
        category: "Cambiador",
        type: "fixed",
        options: [
          { brand: "Leander", model: "Matty", precio_en_pack: 14.88, precio_individual: 44.64, description: "Cambiador ergonómico con diseño danés premium." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Bugaboo", model: "Fox 5", precio_en_pack: 37.68, precio_individual: 113.04, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
          { brand: "Bugaboo", model: "Dragonfly", precio_en_pack: 35.31, precio_individual: 105.93, description: "Carrito ultraligero y compacto, ideal para ciudad." },
        ],
      },
      {
        category: "Hamaca",
        type: "choice",
        options: [
          { brand: "BabyBjörn", model: "Bliss", precio_en_pack: 17.56, precio_individual: 52.68, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
          { brand: "Bugaboo", model: "Giraffe hamaca", precio_en_pack: 18.96, precio_individual: 56.88, description: "Hamaca ergonómica compatible con trona Giraffe." },
        ],
      },
      {
        category: "Porteo",
        type: "choice",
        options: [
          { brand: "Ergobaby", model: "Omni Breeze", precio_en_pack: 15.25, precio_individual: 45.75, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
          { brand: "Boba", model: "Wrap", precio_en_pack: 12.33, precio_individual: 36.99, description: "Fular portabebé elástico, ideal para recién nacidos." },
        ],
      },
      {
        category: "Trona",
        type: "choice",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", precio_en_pack: 21.91, precio_individual: 65.73, description: "La trona de referencia. Crece con el niño hasta adulto." },
          { brand: "Bugaboo", model: "Giraffe trona", precio_en_pack: 18.96, precio_individual: 56.88, description: "Trona evolutiva de diseño con ajuste en altura." },
        ],
      },
      {
        category: "Alfombra de juegos",
        type: "choice",
        options: [
          { brand: "Toddlekind", model: "Alfombra premium", precio_en_pack: 18.21, precio_individual: 54.63, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
          { brand: "Totter & Tumble", model: "Alfombra reversible", precio_en_pack: 16.65, precio_individual: 49.95, description: "Alfombra de juegos reversible con diseños elegantes." },
        ],
      },
    ],
  },
  {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 199,
    duration: "Sin permanencia",
    description: "Todo lo de Comfort más un nivel máximo de delegación y personalización.",
    guarantee: "90 días. Si después de tres meses la carga mental no se reduce, cancelas y Bebloo recoge todo.",
    equipment: [
      {
        category: "Cuna",
        type: "choice",
        options: [
          { brand: "Stokke", model: "Sleepi Mini", precio_en_pack: 43.56, precio_individual: 130.68, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
          { brand: "Stokke", model: "Sleepi Mini Premium", precio_en_pack: 60.00, precio_individual: 180.00, description: "Minicuna ovalada premium. Diseño escandinavo en madera de haya con acabados superiores." },
        ],
      },
      {
        category: "Cambiador",
        type: "choice",
        options: [
          { brand: "Leander", model: "Matty", precio_en_pack: 14.88, precio_individual: 44.64, description: "Cambiador ergonómico con diseño danés premium." },
          { brand: "Leander", model: "Matty Premium", precio_en_pack: 16.50, precio_individual: 49.50, description: "Cambiador ergonómico premium con diseño danés y acabados superiores." },
        ],
      },
      {
        category: "Monitor",
        type: "choice",
        options: [
          { brand: "Premium", model: "Monitor con cámara", precio_en_pack: 13.70, precio_individual: 41.10, description: "Monitor con cámara HD para vigilar al bebé día y noche." },
          { brand: "Angelcare", model: "Monitor premium", precio_en_pack: 17.95, precio_individual: 53.85, description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Bugaboo", model: "Fox 5", precio_en_pack: 37.68, precio_individual: 113.04, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
          { brand: "Bugaboo", model: "Donkey 5", precio_en_pack: 40.50, precio_individual: 121.50, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
          { brand: "Bugaboo", model: "Dragonfly", precio_en_pack: 35.31, precio_individual: 105.93, description: "Carrito ultraligero y compacto, ideal para ciudad." },
          { brand: "Bugaboo", model: "Donkey 5 Duo", precio_en_pack: 45.90, precio_individual: 137.70, description: "Configuración Duo completa del Donkey 5. Máximo espacio y versatilidad." },
        ],
      },
      {
        category: "Hamaca",
        type: "choice",
        options: [
          { brand: "BabyBjörn", model: "Bliss", precio_en_pack: 17.56, precio_individual: 52.68, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
          { brand: "Bugaboo", model: "Giraffe hamaca", precio_en_pack: 18.96, precio_individual: 56.88, description: "Hamaca ergonómica compatible con trona Giraffe." },
          { brand: "Nuna", model: "LEAF Grow", precio_en_pack: 20.50, precio_individual: 61.50, description: "Hamaca de balanceo silencioso que crece con el bebé." },
          { brand: "Nuna", model: "LEAF Curv", precio_en_pack: 25.50, precio_individual: 76.50, description: "Hamaca de balanceo silencioso premium con diseño curvo único." },
        ],
      },
      {
        category: "Porteo",
        type: "choice",
        options: [
          { brand: "Ergobaby", model: "Omni Breeze", precio_en_pack: 15.25, precio_individual: 45.75, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
          { brand: "Boba", model: "Wrap", precio_en_pack: 12.33, precio_individual: 36.99, description: "Fular portabebé elástico, ideal para recién nacidos." },
          { brand: "BabyBjörn", model: "One Air", precio_en_pack: 16.80, precio_individual: 50.40, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
          { brand: "BabyBjörn", model: "Harmony", precio_en_pack: 19.80, precio_individual: 59.40, description: "Portabebé premium con malla 3D ultrasuave y soporte lumbar reforzado." },
        ],
      },
      {
        category: "Trona",
        type: "choice",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", precio_en_pack: 21.91, precio_individual: 65.73, description: "La trona de referencia. Crece con el niño hasta adulto." },
          { brand: "Bugaboo", model: "Giraffe trona", precio_en_pack: 18.96, precio_individual: 56.88, description: "Trona evolutiva de diseño con ajuste en altura." },
          { brand: "Stokke", model: "Tripp Trapp Oak", precio_en_pack: 25.50, precio_individual: 76.50, description: "Trona Tripp Trapp en madera de roble premium. Edición exclusiva." },
        ],
      },
      {
        category: "Alfombra de juegos",
        type: "choice",
        options: [
          { brand: "Toddlekind", model: "Alfombra premium", precio_en_pack: 18.21, precio_individual: 54.63, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
          { brand: "Totter & Tumble", model: "Alfombra reversible", precio_en_pack: 16.65, precio_individual: 49.95, description: "Alfombra de juegos reversible con diseños elegantes." },
          { brand: "Toddlekind", model: "Persian Collection", precio_en_pack: 22.50, precio_individual: 67.50, description: "Alfombra de juegos colección Persian. Diseño exclusivo premium." },
        ],
      },
    ],
  },
];

export const getPlanById = (id: string): PlanData | undefined =>
  plansEquipment.find((p) => p.id === id);

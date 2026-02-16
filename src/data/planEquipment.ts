export interface EquipmentOption {
  brand: string;
  model: string;
  image?: string;
  description?: string;
  precio_individual?: number;
  coste_real_mes?: number;
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
          { brand: "Chicco", model: "Next2Me", coste_real_mes: 15.91, precio_individual: 54.77, precio_en_pack: 24.10, description: "Cuna de colecho segura y práctica. Se acopla a la cama de los padres." },
        ],
      },
      {
        category: "Cambiador",
        type: "fixed",
        options: [
          { brand: "Bebloo", model: "Cambiador portátil", coste_real_mes: 6.96, precio_individual: 32.40, precio_en_pack: 10.58, description: "Cambiador portátil funcional y ligero." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Chicco", model: "Lite Way", coste_real_mes: 8.83, precio_individual: 37.08, precio_en_pack: 13.35, description: "Carrito ligero y compacto, ideal para ciudad." },
          { brand: "Joolz", model: "Aer 2", coste_real_mes: 18.50, precio_individual: 61.25, precio_en_pack: 28.02, description: "Carrito urbano ultraligero con plegado compacto." },
          { brand: "Babyzen", model: "YOYO3", coste_real_mes: 16.79, precio_individual: 56.97, precio_en_pack: 25.43, description: "El carrito compacto por excelencia. Cabe en equipaje de mano." },
        ],
      },
      {
        category: "Hamaca",
        type: "fixed",
        options: [
          { brand: "Fisher Price", model: "Hamaca básica", coste_real_mes: 9.66, precio_individual: 39.15, precio_en_pack: 14.62, description: "Hamaca con balanceo natural, cómoda y segura." },
        ],
      },
      {
        category: "Trona",
        type: "fixed",
        options: [
          { brand: "Chicco", model: "Trona básica", coste_real_mes: 10.77, precio_individual: 41.92, precio_en_pack: 16.35, description: "Trona funcional y ajustable en altura." },
        ],
      },
      {
        category: "Porteo",
        type: "choice",
        options: [
          { brand: "Boba", model: "Wrap", coste_real_mes: 9.25, precio_individual: 38.12, precio_en_pack: 14.02, description: "Fular portabebé elástico, ideal para recién nacidos." },
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
          { brand: "Stokke", model: "Sleepi Mini", coste_real_mes: 32.67, precio_individual: 96.68, precio_en_pack: 43.56, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
        ],
      },
      {
        category: "Cambiador",
        type: "fixed",
        options: [
          { brand: "Leander", model: "Matty", coste_real_mes: 11.17, precio_individual: 42.92, precio_en_pack: 14.88, description: "Cambiador ergonómico con diseño danés premium." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Bugaboo", model: "Fox 5", coste_real_mes: 28.25, precio_individual: 85.62, precio_en_pack: 37.68, description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable." },
          { brand: "Bugaboo", model: "Dragonfly", coste_real_mes: 26.50, precio_individual: 81.25, precio_en_pack: 35.31, description: "Carrito ultraligero y compacto, ideal para ciudad." },
        ],
      },
      {
        category: "Hamaca",
        type: "choice",
        options: [
          { brand: "BabyBjörn", model: "Bliss", coste_real_mes: 13.17, precio_individual: 47.92, precio_en_pack: 17.56, description: "Hamaca con balanceo natural. Tejido suave y transpirable." },
          { brand: "Bugaboo", model: "Giraffe hamaca", coste_real_mes: 14.22, precio_individual: 50.55, precio_en_pack: 18.96, description: "Hamaca ergonómica compatible con trona Giraffe." },
        ],
      },
      {
        category: "Porteo",
        type: "choice",
        options: [
          { brand: "Ergobaby", model: "Omni Breeze", coste_real_mes: 11.44, precio_individual: 43.60, precio_en_pack: 15.25, description: "Malla transpirable SoftFlex. Todas las posiciones desde recién nacido." },
          { brand: "Boba", model: "Wrap", coste_real_mes: 9.25, precio_individual: 38.12, precio_en_pack: 12.33, description: "Fular portabebé elástico, ideal para recién nacidos." },
        ],
      },
      {
        category: "Trona",
        type: "choice",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", coste_real_mes: 16.44, precio_individual: 56.10, precio_en_pack: 21.91, description: "La trona de referencia. Crece con el niño hasta adulto." },
          { brand: "Bugaboo", model: "Giraffe trona", coste_real_mes: 14.22, precio_individual: 50.55, precio_en_pack: 18.96, description: "Trona evolutiva de diseño con ajuste en altura." },
        ],
      },
      {
        category: "Alfombra de juegos",
        type: "choice",
        options: [
          { brand: "Toddlekind", model: "Alfombra premium", coste_real_mes: 13.67, precio_individual: 49.17, precio_en_pack: 18.21, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
          { brand: "Totter & Tumble", model: "Alfombra reversible", coste_real_mes: 12.50, precio_individual: 46.25, precio_en_pack: 16.65, description: "Alfombra de juegos reversible con diseños elegantes." },
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
        type: "fixed",
        options: [
          { brand: "Stokke", model: "Sleepi Mini", coste_real_mes: 32.67, precio_individual: 96.68, precio_en_pack: 39.09, description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya." },
        ],
      },
      {
        category: "Cambiador",
        type: "fixed",
        options: [
          { brand: "Leander", model: "Matty", coste_real_mes: 11.17, precio_individual: 42.92, precio_en_pack: 13.36, description: "Cambiador ergonómico con diseño danés premium." },
        ],
      },
      {
        category: "Monitor",
        type: "fixed",
        options: [
          { brand: "Angelcare", model: "Monitor premium", coste_real_mes: 15.00, precio_individual: 52.50, precio_en_pack: 17.95, description: "Monitor con sensor de movimiento y sonido. Máxima tranquilidad." },
        ],
      },
      {
        category: "Carrito",
        type: "choice",
        options: [
          { brand: "Bugaboo", model: "Donkey 5", coste_real_mes: 30.00, precio_individual: 90.00, precio_en_pack: 35.90, description: "Carrito gemelar/mono convertible. Máxima versatilidad." },
          { brand: "Bugaboo", model: "Dragonfly", coste_real_mes: 26.50, precio_individual: 81.25, precio_en_pack: 31.70, description: "Carrito ultraligero y compacto, ideal para ciudad." },
        ],
      },
      {
        category: "Hamaca",
        type: "fixed",
        options: [
          { brand: "Nuna", model: "LEAF Grow", coste_real_mes: 25.67, precio_individual: 79.18, precio_en_pack: 30.71, description: "Hamaca de balanceo silencioso que crece con el bebé." },
        ],
      },
      {
        category: "Porteo",
        type: "fixed",
        options: [
          { brand: "BabyBjörn", model: "One Air", coste_real_mes: 11.44, precio_individual: 43.60, precio_en_pack: 13.69, description: "Portabebé ergonómico con malla transpirable. De 0 a 3 años." },
        ],
      },
      {
        category: "Trona",
        type: "fixed",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", coste_real_mes: 16.44, precio_individual: 56.10, precio_en_pack: 19.67, description: "La trona de referencia. Crece con el niño hasta adulto." },
        ],
      },
      {
        category: "Alfombra de juegos",
        type: "fixed",
        options: [
          { brand: "Toddlekind", model: "Alfombra premium", coste_real_mes: 13.67, precio_individual: 49.17, precio_en_pack: 16.36, description: "Alfombra de juegos de diseño, suave y fácil de limpiar." },
        ],
      },
    ],
  },
];

export const getPlanById = (id: string): PlanData | undefined =>
  plansEquipment.find((p) => p.id === id);

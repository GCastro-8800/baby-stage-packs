export interface EquipmentOption {
  brand: string;
  model: string;
  image?: string;
}

export interface EquipmentCategory {
  category: string;
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
    price: 59,
    duration: "30 días",
    description: "Una opción básica para probar el servicio durante el inicio.",
    guarantee: "30 días. Puedes cancelar y Bebloo recoge el equipamiento.",
    upgradePlanId: "comfort",
    upgradePlanName: "BEBLOO Comfort",
    equipment: [
      {
        category: "Carrito básico",
        options: [
          { brand: "Bugaboo", model: "Dragonfly" },
          { brand: "Cybex", model: "Eezy S Twist" },
        ],
      },
      {
        category: "Cuna o minicuna",
        options: [
          { brand: "Stokke", model: "Sleepi Mini" },
          { brand: "Babyzen", model: "Yoyo Bassinet" },
        ],
      },
      {
        category: "Cambiador",
        options: [
          { brand: "Stokke", model: "Care" },
          { brand: "IKEA", model: "Sniglar" },
        ],
      },
      {
        category: "Monitor de bebé (solo audio)",
        options: [
          { brand: "Philips Avent", model: "SCD503" },
        ],
      },
    ],
  },
  {
    id: "comfort",
    name: "BEBLOO Comfort",
    price: 129,
    duration: "Sin permanencia",
    description: "Todo el equipamiento esencial, entregado y cambiado por etapas según su crecimiento.",
    guarantee: "60 días. Si no te aporta tranquilidad o reduce tu estrés, cancelas y Bebloo recoge todo sin coste.",
    upgradePlanId: "total-peace",
    upgradePlanName: "BEBLOO Total Peace",
    equipment: [
      {
        category: "Carrito completo (capazo + silla)",
        options: [
          { brand: "Bugaboo", model: "Fox 5" },
          { brand: "Cybex", model: "Priam" },
          { brand: "Stokke", model: "Xplory X" },
        ],
      },
      {
        category: "Cuna o minicuna",
        options: [
          { brand: "Stokke", model: "Sleepi" },
          { brand: "Babyzen", model: "Yoyo Bassinet" },
          { brand: "Cybex", model: "Lemo Cot" },
        ],
      },
      {
        category: "Trona evolutiva",
        options: [
          { brand: "Stokke", model: "Tripp Trapp" },
          { brand: "Cybex", model: "Lemo 2" },
        ],
      },
      {
        category: "Hamaca ergonómica",
        options: [
          { brand: "BabyBjörn", model: "Bliss" },
          { brand: "Stokke", model: "Steps Bouncer" },
        ],
      },
      {
        category: "Mochila portabebé",
        options: [
          { brand: "BabyBjörn", model: "Harmony" },
          { brand: "Ergobaby", model: "Omni Breeze" },
        ],
      },
      {
        category: "Monitor de bebé",
        options: [
          { brand: "Philips Avent", model: "SCD923" },
          { brand: "Eufy", model: "SpaceView Pro" },
        ],
      },
      {
        category: "Cambiador",
        options: [
          { brand: "Stokke", model: "Care" },
        ],
      },
      {
        category: "Parque de juegos",
        options: [
          { brand: "Stokke", model: "Flexi Bath Stand" },
          { brand: "BabyDan", model: "Park-A-Kid" },
        ],
      },
    ],
  },
  {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 149,
    duration: "Sin permanencia",
    description: "Todo lo de Comfort más un nivel máximo de delegación y personalización.",
    guarantee: "90 días. Si después de tres meses la carga mental no se reduce, cancelas y Bebloo recoge todo.",
    equipment: [
      {
        category: "Todo el equipamiento de Comfort",
        options: [
          { brand: "Bugaboo", model: "Fox 5" },
          { brand: "Cybex", model: "Priam" },
          { brand: "Stokke", model: "Xplory X" },
        ],
      },
      {
        category: "Adaptación continua",
        options: [
          { brand: "Bebloo", model: "Selección personalizada según necesidades" },
        ],
      },
    ],
  },
];

export const getPlanById = (id: string): PlanData | undefined =>
  plansEquipment.find((p) => p.id === id);

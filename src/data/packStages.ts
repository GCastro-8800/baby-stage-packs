import type { EquipmentOption } from "./planEquipment";

export interface PackStage {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  products: {
    category: string;
    options: EquipmentOption[];
  }[];
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
    price: 59,
    tagline: "Lo esencial para empezar con tranquilidad",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Todo lo que necesitas tener listo antes de que llegue el bebé.",
        products: [
          {
            category: "Cuna o minicuna",
            options: [
              { brand: "Stokke", model: "Sleepi Mini", description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 25 },
              { brand: "Babyzen", model: "Yoyo Bassinet", description: "Capazo ligero compatible con el chasis Yoyo. Ventilación optimizada.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 22 },
            ],
          },
          {
            category: "Cambiador",
            options: [
              { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 15 },
              { brand: "IKEA", model: "Sniglar", description: "Cambiador funcional y asequible en madera de haya. Sencillo y estable.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 8 },
            ],
          },
          {
            category: "Monitor de bebé (solo audio)",
            options: [
              { brand: "Philips Avent", model: "SCD503", description: "Monitor DECT con sonido cristalino y luz nocturna. Alcance de 330m.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 10 },
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
            category: "Carrito básico",
            options: [
              { brand: "Bugaboo", model: "Dragonfly", description: "Carrito ultraligero y compacto, ideal para ciudad. Plegado con una mano.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 35 },
              { brand: "Cybex", model: "Eezy S Twist", description: "Silla giratoria 360° con plegado compacto. Perfecta para espacios reducidos.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 30 },
            ],
          },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Tu bebé crece y necesita nuevo equipamiento adaptado.",
        products: [],
      },
    ],
  },
  comfort: {
    id: "comfort",
    name: "BEBLOO Comfort",
    price: 129,
    tagline: "Todo el equipamiento esencial, entregado por etapas",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Prepara la habitación del bebé con todo lo necesario antes de su llegada.",
        products: [
          {
            category: "Cuna o minicuna",
            options: [
              { brand: "Stokke", model: "Sleepi", description: "Cuna evolutiva ovalada que se transforma en cama infantil. Hasta los 5 años.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 35 },
              { brand: "Babyzen", model: "Yoyo Bassinet", description: "Capazo ligero compatible con el chasis Yoyo. Ventilación optimizada.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 28 },
              { brand: "Cybex", model: "Lemo Cot", description: "Cuna de diseño minimalista con laterales de malla transpirable.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 30 },
            ],
          },
          {
            category: "Cambiador",
            options: [
              { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 18 },
            ],
          },
          {
            category: "Monitor de bebé",
            options: [
              { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 15 },
              { brand: "Eufy", model: "SpaceView Pro", description: "Pantalla grande de 5\", sin WiFi para máxima privacidad. Batería duradera.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 14 },
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
            category: "Carrito completo (capazo + silla)",
            options: [
              { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 45 },
              { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 42 },
              { brand: "Stokke", model: "Xplory X", description: "Altura única que acerca al bebé. Diseño icónico escandinavo.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 48 },
            ],
          },
          {
            category: "Hamaca ergonómica",
            options: [
              { brand: "BabyBjörn", model: "Bliss", description: "Hamaca con balanceo natural. Tejido suave y transpirable, sin baterías.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 20 },
              { brand: "Stokke", model: "Steps Bouncer", description: "Hamaca que se acopla a la trona Steps. Movimiento suave y natural.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 22 },
            ],
          },
          {
            category: "Mochila portabebé",
            options: [
              { brand: "BabyBjörn", model: "Harmony", description: "Portabebé ergonómico con soporte lumbar acolchado. De 0 a 3 años.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 18 },
              { brand: "Ergobaby", model: "Omni Breeze", description: "Malla transpirable SoftFlex. Todas las posiciones de porteo desde recién nacido.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 20 },
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
            category: "Trona evolutiva",
            options: [
              { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 25 },
              { brand: "Cybex", model: "Lemo 2", description: "Trona moderna con ajuste en altura y profundidad. Diseño elegante.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 22 },
            ],
          },
          {
            category: "Parque de juegos",
            options: [
              { brand: "Stokke", model: "Flexi Bath Stand", description: "Soporte plegable multifunción. Ideal como base segura para el baño del bebé.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 15 },
              { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 18 },
            ],
          },
        ],
      },
    ],
  },
  "total-peace": {
    id: "total-peace",
    name: "BEBLOO Total Peace",
    price: 149,
    tagline: "Todo lo de Comfort + máxima delegación y personalización",
    stages: [
      {
        id: "etapa-0",
        name: "Etapa 0 — Preparación",
        subtitle: "Prenatal / Recién nacido",
        description: "Todo preparado antes de la llegada, con opciones premium y asesoramiento personal.",
        products: [
          {
            category: "Cuna o minicuna",
            options: [
              { brand: "Stokke", model: "Sleepi", description: "Cuna evolutiva ovalada que se transforma en cama infantil. Hasta los 5 años.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 38 },
              { brand: "Babyzen", model: "Yoyo Bassinet", description: "Capazo ligero compatible con el chasis Yoyo. Ventilación optimizada.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 30 },
              { brand: "Cybex", model: "Lemo Cot", description: "Cuna de diseño minimalista con laterales de malla transpirable.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop", precio_individual: 32 },
            ],
          },
          {
            category: "Cambiador",
            options: [
              { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 20 },
            ],
          },
          {
            category: "Monitor de bebé premium",
            options: [
              { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 18 },
              { brand: "Eufy", model: "SpaceView Pro", description: "Pantalla grande de 5\", sin WiFi para máxima privacidad. Batería duradera.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 16 },
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
            category: "Carrito completo (capazo + silla)",
            options: [
              { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 50 },
              { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 48 },
              { brand: "Stokke", model: "Xplory X", description: "Altura única que acerca al bebé. Diseño icónico escandinavo.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop", precio_individual: 52 },
            ],
          },
          {
            category: "Hamaca ergonómica",
            options: [
              { brand: "BabyBjörn", model: "Bliss", description: "Hamaca con balanceo natural. Tejido suave y transpirable, sin baterías.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 22 },
              { brand: "Stokke", model: "Steps Bouncer", description: "Hamaca que se acopla a la trona Steps. Movimiento suave y natural.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 24 },
            ],
          },
          {
            category: "Mochila portabebé",
            options: [
              { brand: "BabyBjörn", model: "Harmony", description: "Portabebé ergonómico con soporte lumbar acolchado. De 0 a 3 años.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 20 },
              { brand: "Ergobaby", model: "Omni Breeze", description: "Malla transpirable SoftFlex. Todas las posiciones de porteo desde recién nacido.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", precio_individual: 22 },
            ],
          },
          {
            category: "Adaptación personalizada",
            options: [
              { brand: "Bebloo", model: "Selección personalizada", description: "Tu asesor personal adapta el equipamiento a medida que tu bebé crece y cambian tus necesidades.", precio_individual: 0 },
            ],
          },
        ],
      },
      {
        id: "etapa-2",
        name: "Etapa 2 — Crecimiento",
        subtitle: "6–12 meses",
        description: "Trona, parque y adaptaciones continuas con tu asesor personal.",
        products: [
          {
            category: "Trona evolutiva",
            options: [
              { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 28 },
              { brand: "Cybex", model: "Lemo 2", description: "Trona moderna con ajuste en altura y profundidad. Diseño elegante.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 25 },
            ],
          },
          {
            category: "Parque de juegos",
            options: [
              { brand: "Stokke", model: "Flexi Bath Stand", description: "Soporte plegable multifunción. Ideal como base segura para el baño del bebé.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 18 },
              { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop", precio_individual: 20 },
            ],
          },
          {
            category: "Adaptación personalizada",
            options: [
              { brand: "Bebloo", model: "Selección personalizada", description: "Tu asesor personal adapta el equipamiento según las nuevas necesidades de tu bebé.", precio_individual: 0 },
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
    (sum, stage) => sum + stage.products.reduce((s, cat) => s + cat.options.length, 0),
    0
  );
};

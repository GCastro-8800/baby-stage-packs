export interface EquipmentOption {
  brand: string;
  model: string;
  image?: string;
  description?: string;
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
          { brand: "Bugaboo", model: "Dragonfly", description: "Carrito ultraligero y compacto, ideal para ciudad. Plegado con una mano.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Eezy S Twist", description: "Silla giratoria 360° con plegado compacto. Perfecta para espacios reducidos.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cuna o minicuna",
        options: [
          { brand: "Stokke", model: "Sleepi Mini", description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
          { brand: "Babyzen", model: "Yoyo Bassinet", description: "Capazo ligero compatible con el chasis Yoyo. Ventilación optimizada.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cambiador",
        options: [
          { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "IKEA", model: "Sniglar", description: "Cambiador funcional y asequible en madera de haya. Sencillo y estable.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Monitor de bebé (solo audio)",
        options: [
          { brand: "Philips Avent", model: "SCD503", description: "Monitor DECT con sonido cristalino y luz nocturna. Alcance de 330m.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
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
          { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Xplory X", description: "Altura única que acerca al bebé. Diseño icónico escandinavo.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cuna o minicuna",
        options: [
          { brand: "Stokke", model: "Sleepi", description: "Cuna evolutiva ovalada que se transforma en cama infantil. Hasta los 5 años.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
          { brand: "Babyzen", model: "Yoyo Bassinet", description: "Capazo ligero compatible con el chasis Yoyo. Ventilación optimizada.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Lemo Cot", description: "Cuna de diseño minimalista con laterales de malla transpirable.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Trona evolutiva",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Lemo 2", description: "Trona moderna con ajuste en altura y profundidad. Diseño elegante.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Hamaca ergonómica",
        options: [
          { brand: "BabyBjörn", model: "Bliss", description: "Hamaca con balanceo natural. Tejido suave y transpirable, sin baterías.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Steps Bouncer", description: "Hamaca que se acopla a la trona Steps. Movimiento suave y natural.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Mochila portabebé",
        options: [
          { brand: "BabyBjörn", model: "Harmony", description: "Portabebé ergonómico con soporte lumbar acolchado. De 0 a 3 años.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
          { brand: "Ergobaby", model: "Omni Breeze", description: "Malla transpirable SoftFlex. Todas las posiciones de porteo desde recién nacido.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Monitor de bebé",
        options: [
          { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
          { brand: "Eufy", model: "SpaceView Pro", description: "Pantalla grande de 5\", sin WiFi para máxima privacidad. Batería duradera.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cambiador",
        options: [
          { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Parque de juegos",
        options: [
          { brand: "Stokke", model: "Flexi Bath Stand", description: "Soporte plegable multifunción. Ideal como base segura para el baño del bebé.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
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
          { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Xplory X", description: "Altura única que acerca al bebé. Diseño icónico escandinavo.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Adaptación continua",
        options: [
          { brand: "Bebloo", model: "Selección personalizada según necesidades", description: "Tu asesor personal adapta el equipamiento a medida que tu bebé crece y cambian tus necesidades." },
        ],
      },
    ],
  },
];

export const getPlanById = (id: string): PlanData | undefined =>
  plansEquipment.find((p) => p.id === id);

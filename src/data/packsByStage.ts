import type { EquipmentOption } from "./planEquipment";

export interface StageData {
  id: string;
  name: string;
  ageRange: string;
  description: string;
  cta: string;
  equipment: {
    category: string;
    why: string;
    options: EquipmentOption[];
  }[];
}

export const packsByStage: StageData[] = [
  {
    id: "0-3m",
    name: "Primeros días",
    ageRange: "0–3 meses",
    description:
      "Todo gira alrededor del descanso, el contacto piel con piel y los primeros paseos. Necesitas lo esencial, bien pensado, para que tú también puedas descansar.",
    cta: "Empieza con todo listo desde el primer día",
    equipment: [
      {
        category: "Carrito con capazo",
        why: "Para los primeros paseos tumbado, protegido del sol y el viento.",
        options: [
          { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Xplory X", description: "Altura única que acerca al bebé. Diseño icónico escandinavo.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cuna o minicuna",
        why: "El primer espacio seguro para dormir. Una buena cuna marca la diferencia en el sueño de toda la familia.",
        options: [
          { brand: "Stokke", model: "Sleepi Mini", description: "Minicuna ovalada que crece con el bebé. Diseño escandinavo en madera de haya.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Sleepi", description: "Cuna evolutiva ovalada que se transforma en cama infantil. Hasta los 5 años.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cambiador",
        why: "Cambiar pañales cómoda y ergonómicamente, sin dolor de espalda.",
        options: [
          { brand: "Stokke", model: "Care", description: "Cambiador ergonómico a la altura perfecta. Madera maciza con múltiples alturas.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Monitor de bebé",
        why: "Tranquilidad mientras duerme. Sabes que está bien sin tener que entrar.",
        options: [
          { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
          { brand: "Eufy", model: "SpaceView Pro", description: "Pantalla grande de 5\", sin WiFi para máxima privacidad. Batería duradera.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Hamaca ergonómica",
        why: "Un lugar seguro donde dejarlo un momento mientras cocinas o te duchas.",
        options: [
          { brand: "BabyBjörn", model: "Bliss", description: "Hamaca con balanceo natural. Tejido suave y transpirable, sin baterías.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "Stokke", model: "Steps Bouncer", description: "Hamaca que se acopla a la trona Steps. Movimiento suave y natural.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Mochila portabebé",
        why: "Paseos con las manos libres y contacto piel con piel que calma al bebé.",
        options: [
          { brand: "BabyBjörn", model: "Harmony", description: "Portabebé ergonómico con soporte lumbar acolchado. De 0 a 3 años.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
          { brand: "Ergobaby", model: "Omni Breeze", description: "Malla transpirable SoftFlex. Todas las posiciones de porteo desde recién nacido.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
    ],
  },
  {
    id: "3-6m",
    name: "Descubriendo el mundo",
    ageRange: "3–6 meses",
    description:
      "El bebé empieza a sostener la cabeza, a sonreír y a interesarse por todo. Es momento de incorporar la trona y el parque para que explore con seguridad.",
    cta: "El equipamiento evoluciona con tu bebé",
    equipment: [
      {
        category: "Carrito (cambio a silla)",
        why: "Ya sostiene la cabeza: pasa del capazo a la silla para ver el mundo sentado.",
        options: [
          { brand: "Bugaboo", model: "Fox 5", description: "El todoterreno premium. Suspensión avanzada, capazo amplio y reclinable.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Priam", description: "Elegancia y funcionalidad. Chasis ligero con amortiguación en todas las ruedas.", image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Trona evolutiva",
        why: "Empieza la alimentación complementaria. La trona le da un sitio seguro en la mesa familiar.",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Lemo 2", description: "Trona moderna con ajuste en altura y profundidad. Diseño elegante.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Parque de juegos",
        why: "Un espacio delimitado y seguro para que explore sin riesgo mientras tú haces otras cosas.",
        options: [
          { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Monitor de bebé",
        why: "Sigue siendo imprescindible para las siestas y la noche.",
        options: [
          { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
    ],
  },
  {
    id: "6-9m",
    name: "Explorando",
    ageRange: "6–9 meses",
    description:
      "Empieza a gatear, a sentarse solo y a querer tocarlo todo. El parque y la trona se convierten en protagonistas del día a día.",
    cta: "Sin comprar, sin acumular",
    equipment: [
      {
        category: "Parque de juegos",
        why: "Ahora que gatea, necesita un espacio seguro donde moverse libremente.",
        options: [
          { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Trona evolutiva",
        why: "Uso diario en cada comida. La postura correcta favorece la autonomía alimentaria.",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
          { brand: "Cybex", model: "Lemo 2", description: "Trona moderna con ajuste en altura y profundidad. Diseño elegante.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Monitor de bebé",
        why: "Se mueve mucho más: el monitor te da tranquilidad en siestas y noche.",
        options: [
          { brand: "Philips Avent", model: "SCD923", description: "Monitor con vídeo HD y conexión segura. Visión nocturna y canciones de cuna.", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop" },
        ],
      },
    ],
  },
  {
    id: "9-12m",
    name: "Creciendo",
    ageRange: "9–12 meses",
    description:
      "Se pone de pie, da sus primeros pasos y come prácticamente de todo. El equipamiento evoluciona con él para seguir siendo útil.",
    cta: "Todo incluido hasta su primer cumpleaños",
    equipment: [
      {
        category: "Trona evolutiva",
        why: "Ahora come solo. La trona correcta fomenta su independencia en la mesa.",
        options: [
          { brand: "Stokke", model: "Tripp Trapp", description: "La trona de referencia. Crece con el niño desde recién nacido hasta adulto.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Parque de juegos",
        why: "Sigue siendo su zona segura para jugar mientras tú estás cerca.",
        options: [
          { brand: "BabyDan", model: "Park-A-Kid", description: "Parque plegable y portátil con base acolchada. Fácil de montar y guardar.", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop" },
        ],
      },
      {
        category: "Cuna evolutiva",
        why: "La cuna se adapta a su tamaño. Ya no necesita minicuna, necesita espacio.",
        options: [
          { brand: "Stokke", model: "Sleepi", description: "Cuna evolutiva ovalada que se transforma en cama infantil. Hasta los 5 años.", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop" },
        ],
      },
    ],
  },
];

import imgBabybjornBliss from "@/assets/products/babybjorn-bliss.png";
import imgBabybjornBalanceSoft from "@/assets/products/babybjorn-balance-soft.png";
import imgBabybjornHarmony from "@/assets/products/babybjorn-harmony.png";
import imgBobaWrap from "@/assets/products/boba-wrap.png";
import imgTronaBugabooGiraffe from "@/assets/products/trona-bugaboo-giraffe.png";
import imgCambiador from "@/assets/products/cambiador.png";
import imgErgobaby from "@/assets/products/ergobaby-omni.png";
import imgYoyo3 from "@/assets/products/babyzen-yoyo3.png";
import imgDonkey3 from "@/assets/products/bugaboo-donkey-3.png";
import imgDragonfly from "@/assets/products/bugaboo-dragonfly.png";
import imgFox3 from "@/assets/products/bugaboo-fox-3.png";
import imgJoolzAer2 from "@/assets/products/joolz-aer-2.png";
import imgSleepiMini from "@/assets/products/stokke-sleepi-mini.png";
import imgMoisesMimbre from "@/assets/products/moises-mimbre.png";
import imgTrippTrapp from "@/assets/products/stokke-tripp-trapp.png";
import imgGiraffeHamaca from "@/assets/products/bugaboo-giraffe-hamaca.png";
import imgNunaLeaf from "@/assets/products/nuna-leaf-grow.png";

export type ProductCategory = "movilidad" | "descanso" | "porteo" | "alimentacion" | "extras";
export type ProductStage = "0-4" | "4-8" | "8-12" | "12-24" | "ambas";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  stage: ProductStage;
  pricePerMonth: number;
  prices: Record<number, number>;
  description: string;
  shortReason?: string;
  image?: string;
  specs?: Record<string, string>;
}

export const PRODUCT_CATALOG: Product[] = [
  // === MOVILIDAD (5) ===
  {
    id: "bugaboo-fox-3",
    name: "Bugaboo Fox 3",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 70,
    prices: { 1: 70, 3: 67, 6: 60, 12: 48, 24: 34 },
    description: "Suspensión en 4 ruedas, capazo reversible y cesta XXL de 30 L. Chasis de aluminio con tejidos repelentes al agua. 9.9 kg.",
    shortReason: "Máxima calidad y confort",
    image: imgFox3,
    specs: { "Peso": "9.9 kg", "Capacidad cesta": "30 L", "Materiales": "Aluminio, tejido repelente al agua", "Edad": "0–36 meses" },
  },
  {
    id: "bugaboo-donkey-3",
    name: "Bugaboo Donkey 3",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 90,
    prices: { 1: 90, 3: 86, 6: 77, 12: 62, 24: 43 },
    description: "Convertible de mono a dúo en segundos. Suspensión mejorada, capota XXL y doble cesta de 30 L. 12.5 kg.",
    shortReason: "Extensible mono/dúo",
    image: imgDonkey3,
    specs: { "Peso": "12.5 kg", "Capacidad cesta": "Doble, 30 L", "Materiales": "Aluminio", "Edad": "0–36 meses" },
  },
  {
    id: "bugaboo-dragonfly",
    name: "Bugaboo Dragonfly",
    brand: "Bugaboo",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 80,
    prices: { 1: 80, 3: 76, 6: 68, 12: 55, 24: 38 },
    description: "Compacto premium con materiales bio-based (21 % menos CO₂). Plegado en una pieza con correa de transporte. 7.9 kg.",
    shortReason: "Ligero con sello Bugaboo",
    image: imgDragonfly,
    specs: { "Peso": "7.9 kg", "Plegado": "Una pieza con correa", "Materiales": "Bio-based, −21 % CO₂", "Edad": "0–36 meses" },
  },
  {
    id: "joolz-aer-2",
    name: "Joolz Aer 2",
    brand: "Joolz",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 75,
    prices: { 1: 75, 3: 71, 6: 64, 12: 51, 24: 36 },
    description: "Ultraligero de 6.5 kg en aluminio aeroespacial y tejido reciclado REPREVE. Capota UPF 50+. Cabe en cabina.",
    shortReason: "Ultraligero (6.5 kg)",
    image: imgJoolzAer2,
    specs: { "Peso": "6.5 kg", "Cabina avión": "Sí", "Materiales": "Aluminio aeroespacial, REPREVE", "Protección solar": "UPF 50+", "Edad": "0–36 meses" },
  },
  {
    id: "babyzen-yoyo3",
    name: "Babyzen YOYO3",
    brand: "Babyzen",
    category: "movilidad",
    stage: "ambas",
    pricePerMonth: 55,
    prices: { 1: 55, 3: 52, 6: 47, 12: 38, 24: 26 },
    description: "Respaldo mejorado de 47 cm y capota ampliada respecto al YOYO2. Plegado ultra-compacto para cabina. 6.2 kg.",
    shortReason: "El más compacto y económico",
    image: imgYoyo3,
    specs: { "Peso": "6.2 kg", "Respaldo": "47 cm", "Cabina avión": "Sí", "Materiales": "Aluminio", "Edad": "0–36 meses" },
  },

  // === DESCANSO (2) ===
  {
    id: "stokke-sleepi-mini",
    name: "Stokke Sleepi Mini",
    brand: "Stokke",
    category: "descanso",
    stage: "0-4",
    pricePerMonth: 60,
    prices: { 1: 60, 3: 57, 6: 51, 12: 34, 24: 24 },
    description: "Minicuna ovalada en madera de haya FSC con ruedas giratorias. Solo 67 cm de ancho, perfecta para espacios pequeños. Garantía 7 años.",
    shortReason: "Diseño escandinavo premium",
    image: imgSleepiMini,
    specs: { "Ancho": "67 cm", "Materiales": "Madera haya FSC", "Garantía": "7 años", "Edad": "0–6 meses" },
  },
  {
    id: "moises-mimbre",
    name: "Moisés de mimbre",
    brand: "Artesanal",
    category: "descanso",
    stage: "0-4",
    pricePerMonth: 50,
    prices: { 1: 50, 3: 48, 6: 43, 12: 34, 24: 24 },
    description: "Artesanal en mimbre natural con asas de cuero y forro de algodón orgánico GOTS. Solo 2.5 kg.",
    shortReason: "Clásico y acogedor",
    image: imgMoisesMimbre,
    specs: { "Peso": "2.5 kg", "Materiales": "Mimbre natural, algodón orgánico GOTS", "Edad": "0–4 meses" },
  },

  // === ALIMENTACIÓN (2) ===
  {
    id: "trona-stokke-tripp-trapp",
    name: "Stokke Tripp Trapp",
    brand: "Stokke",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 45,
    prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 },
    description: "Diseño icónico desde 1972 en madera de haya FSC. Evolutiva de bebé a adulto (136 kg). Garantía 7 años.",
    shortReason: "Icónica y evolutiva",
    image: imgTrippTrapp,
    specs: { "Carga máxima": "136 kg", "Materiales": "Madera haya FSC", "Garantía": "7 años", "Edad": "Desde 6 meses" },
  },
  {
    id: "trona-bugaboo-giraffe",
    name: "Bugaboo Giraffe",
    brand: "Bugaboo",
    category: "alimentacion",
    stage: "4-8",
    pricePerMonth: 50,
    prices: { 1: 50, 3: 48, 6: 43, 12: 34, 24: 24 },
    description: "4 alturas regulables con pedal. Bandeja apta lavavajillas con bordes elevados. Plegable y compacta.",
    shortReason: "Diseño Bugaboo premium",
    image: imgTronaBugabooGiraffe,
    specs: { "Alturas": "4 regulables con pedal", "Bandeja": "Apta lavavajillas", "Plegable": "Sí", "Edad": "Desde 6 meses" },
  },

  // === PORTEO Y CONFORT (7) ===
  {
    id: "babybjorn-bliss",
    name: "BabyBjörn Bliss/Balance",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 40,
    prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 },
    description: "Balanceo natural con el movimiento del bebé. Tres posiciones, plegado plano de 11 cm. Solo 2.1 kg.",
    shortReason: "Clásica y fiable",
    image: imgBabybjornBliss,
    specs: { "Peso": "2.1 kg", "Plegado": "11 cm plano", "Posiciones": "3", "Edad": "0–24 meses" },
  },
  {
    id: "bugaboo-giraffe-hamaca",
    name: "Bugaboo Giraffe Hamaca",
    brand: "Bugaboo",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 40,
    prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 },
    description: "2 en 1: hamaca reclinable con 5 posiciones y trona con bandeja apta para lavavajillas.",
    shortReason: "Diseño Bugaboo integrado",
    specs: { "Posiciones": "5 reclinables", "Función": "2 en 1: hamaca + trona", "Edad": "0–6 meses" },
  },
  {
    id: "nuna-leaf-grow",
    name: "Nuna LEAF Grow",
    brand: "Nuna",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 45,
    prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 },
    description: "Balanceo silencioso hasta 2 min sin pilas ni motor. Evolutiva de recién nacido a 60 kg.",
    shortReason: "Hamaca que crece con tu hijo",
    specs: { "Carga máxima": "60 kg", "Balanceo": "Hasta 2 min sin motor", "Edad": "0–36 meses" },
  },
  {
    id: "babybjorn-balance-soft",
    name: "BabyBjörn Balance Soft",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 40,
    prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 },
    description: "Tejido jersey de algodón 100 % extra-suave. Balanceo ergonómico natural. Plegado compacto. 2.1 kg.",
    shortReason: "Máximo confort ergonómico",
    image: imgBabybjornBalanceSoft,
    specs: { "Peso": "2.1 kg", "Materiales": "Jersey algodón 100 %", "Edad": "0–24 meses" },
  },
  {
    id: "babybjorn-harmony",
    name: "BabyBjörn Harmony",
    brand: "BabyBjörn",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 45,
    prices: { 1: 45, 3: 43, 6: 38, 12: 31, 24: 22 },
    description: "Edición premium con malla 3D transpirable y detalles en cuero vegano. Certificada Nordic Swan. 2.2 kg.",
    shortReason: "Porteo premium y ergonómico",
    image: imgBabybjornHarmony,
    specs: { "Peso": "2.2 kg", "Materiales": "Malla 3D, cuero vegano", "Certificación": "Nordic Swan", "Edad": "0–24 meses" },
  },
  {
    id: "ergobaby-omni",
    name: "Ergobaby Omni",
    brand: "Ergobaby",
    category: "porteo",
    stage: "ambas",
    pricePerMonth: 40,
    prices: { 1: 40, 3: 38, 6: 34, 12: 27, 24: 19 },
    description: "4 posiciones desde recién nacido sin inserto. Malla SoftFlex transpirable. Capucha solar UPF 50+. 0.79 kg.",
    shortReason: "Ergonómica y versátil",
    image: imgErgobaby,
    specs: { "Peso": "0.79 kg", "Posiciones": "4 sin inserto", "Materiales": "SoftFlex", "Protección solar": "UPF 50+", "Edad": "0–48 meses" },
  },
  {
    id: "boba-wrap",
    name: "Boba Wrap",
    brand: "Boba",
    category: "porteo",
    stage: "0-4",
    pricePerMonth: 25,
    prices: { 1: 25, 3: 24, 6: 21, 12: 17, 24: 12 },
    description: "Fular elástico de algodón peinado (95 %) y spandex. Talla única, contacto piel con piel. Solo 0.54 kg.",
    shortReason: "Porteo natural desde el día 1",
    image: imgBobaWrap,
    specs: { "Peso": "0.54 kg", "Talla": "Única", "Materiales": "Algodón peinado 95 %, spandex", "Edad": "0–18 meses" },
  },

  // === EXTRAS (1) ===
  {
    id: "cambiador",
    name: "Cambiador de mimbre",
    brand: "Artesanal",
    category: "extras",
    stage: "0-4",
    pricePerMonth: 35,
    prices: { 1: 35, 3: 33, 6: 30, 12: 24, 24: 17 },
    description: "Cesta artesanal con colchoneta impermeable incluida y compartimentos para pañales. 1.8 kg.",
    shortReason: "Artesanal y funcional",
    image: imgCambiador,
    specs: { "Peso": "1.8 kg", "Materiales": "Mimbre, colchoneta impermeable", "Edad": "0–12 meses" },
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
  "0-4": "De 0 a 4 meses",
  "4-8": "De 4 a 8 meses",
  "8-12": "De 8 a 12 meses",
  "12-24": "De 12 a 24 meses",
};

export const ALL_STAGES = ["0-4", "4-8", "8-12", "12-24"] as const;

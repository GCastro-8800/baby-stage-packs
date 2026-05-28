import type { Stage } from "@/types/baby";

interface EmotionalTipProps {
  stage: Stage | null;
  isFirstChild: boolean | null | undefined;
}

const TIPS: Record<Stage, { firstTime: string[]; experienced: string[] }> = {
  prenatal: {
    firstTime: [
      "Es normal tener mil preguntas. Estamos aquí para acompañarte.",
      "No necesitas tenerlo todo claro. Solo necesitas empezar.",
      "Cada día que pasa, tu bebé y tú os preparáis juntos.",
    ],
    experienced: [
      "Ya conoces el camino, pero cada bebé es único.",
      "Esta vez sabes que lo importante es disfrutar el proceso.",
      "Tu experiencia es tu mejor aliada. Confía en ella.",
    ],
  },
  "0-3m": {
    firstTime: [
      "Los primeros días son intensos. Descansa cuando puedas.",
      "No hay manual perfecto. Tú ya eres lo que tu bebé necesita.",
      "Cada día aprendes algo nuevo. Y tu bebé también.",
    ],
    experienced: [
      "Ya sabes que este Momento pasa rápido. Disfrútalo.",
      "Con experiencia, los miedos se convierten en confianza.",
      "Cada hijo trae su propia magia. Déjate sorprender.",
    ],
  },
  "3-6m": {
    firstTime: [
      "Tu bebé empieza a descubrir el mundo. Y tú a conocerlo.",
      "Las primeras risas son el mejor regalo. Van a llegar.",
      "Estás encontrando tu ritmo. Y lo estás haciendo genial.",
    ],
    experienced: [
      "Cada hijo es diferente. Disfruta las sorpresas.",
      "Ya sabes: este Momento tiene más risas que noches sin dormir.",
      "Tu tranquilidad se la transmites. Eso vale oro.",
    ],
  },
  "6-12m": {
    firstTime: [
      "La curiosidad de tu bebé crece cada día. Acompáñalo.",
      "Empezará a moverse más. Tu casa se convierte en su mundo.",
      "Cada logro suyo es también un logro tuyo.",
      "Su personalidad brilla cada vez más. Conócelo sin prisa.",
    ],
    experienced: [
      "Este Momento es mágico. Cada instante cuenta.",
      "Ya sabes que gatear es una aventura. Disfruta verlo explorar.",
      "Tu calma le da seguridad para atreverse a más.",
      "El primer año vuela. Saborea cada logro.",
    ],
  },
  "12-18m": {
    firstTime: [
      "Pronto dará sus primeros pasos. Tú ya has dado muchos.",
      "El primer año casi termina. Lo estás haciendo increíble.",
      "Camina, habla, explora. Y tú le has dado las raíces.",
    ],
    experienced: [
      "Sabes que los primeros pasos llegan cuando menos los esperas.",
      "Otro pequeño a punto de caminar. La casa se llena de vida.",
      "Cada hijo te enseña algo nuevo. Este no será la excepción.",
    ],
  },
  "18-24m": {
    firstTime: [
      "Ya no es un bebé pequeño. Lo estás haciendo increíble.",
      "Mírate: acompañándole a descubrir el mundo. Enhorabuena.",
      "Cada día gana autonomía. Tú le das la seguridad.",
    ],
    experienced: [
      "Otro aventurero en casa. La diversión continúa.",
      "La experiencia se nota. Tu familia crece con confianza.",
      "Disfruta verle convertirse en quien es.",
    ],
  },

};

function getDayIndex(): number {
  return new Date().getDay();
}

export function EmotionalTip({ stage, isFirstChild }: EmotionalTipProps) {
  if (!stage) return null;

  const tipSet = TIPS[stage];
  const pool = isFirstChild === false ? tipSet.experienced : tipSet.firstTime;
  const tip = pool[getDayIndex() % pool.length];

  return (
    <section aria-label="Pensamiento del día" className="py-8 md:py-12">
      <p className="eyebrow mb-5 text-[10px]">Para ti, hoy</p>
      <blockquote
        className="font-serif text-foreground text-balance max-w-3xl leading-snug"
        style={{
          fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        "{tip}"
      </blockquote>
    </section>
  );
}

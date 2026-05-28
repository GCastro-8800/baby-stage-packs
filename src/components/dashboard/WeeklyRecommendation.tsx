import type { Stage } from "@/types/baby";

interface WeeklyRecommendationProps {
  stage: Stage | null;
}

const RECOMMENDATIONS: Record<Stage, string[]> = {
  prenatal: [
    "Dedica 10 minutos al día a hablarle a tu barriga. Tu voz ya le calma.",
    "Prepara una playlist suave. La escuchará dentro y fuera.",
    "Haz una lista corta de lo esencial. Menos es más.",
    "Camina 20 minutos al día. Tu cuerpo y tu mente lo agradecerán.",
  ],
  "0-3m": [
    "Prueba 15 minutos de contacto piel con piel cada día.",
    "Cántale una canción suave antes de dormir. Creará un ritual.",
    "Observa sus manos: pronto descubrirá que son suyas.",
    "Descansa cuando duerma. La casa puede esperar.",
  ],
  "3-6m": [
    "Ponle objetos de colores vivos a su alcance. Querrá agarrarlos.",
    "Juega al 'cucú-tras'. Le encanta y le enseña permanencia.",
    "Léele un cuento corto con voces. No importa que no entienda.",
    "Déjale tiempo en el suelo boca abajo. Fortalece su cuello y espalda.",
  ],
  "6-12m": [
    "Dale una cuchara segura para que practique llevársela a la boca.",
    "Juega a esconder un juguete bajo una tela. Buscará debajo.",
    "Llévale al parque y deja que toque el césped y las hojas.",
    "Aplaude sus logros. Tu entusiasmo es su mejor motor.",
    "Nombra las cosas que señala. Está construyendo vocabulario.",
    "Dale recipientes para meter y sacar cosas. Le fascina.",
  ],
  "12-18m": [
    "Camina con él de la mano. Cada paso cuenta.",
    "Baila con él en brazos. La música y el movimiento le estimulan.",
    "Déjale elegir entre dos opciones sencillas. Le da autonomía.",
    "Lee juntos cada noche. Será uno de sus mejores recuerdos.",
  ],
  "18-24m": [
    "Pinta con los dedos. Ensuciar también es aprender.",
    "Llévale a conocer texturas nuevas: arena, agua, plastilina.",
    "Inventad juegos sencillos juntos. Su imaginación despierta.",
    "Cántale canciones con gestos. Repetirá lo que pueda.",
  ],

};

function getWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

export function WeeklyRecommendation({ stage }: WeeklyRecommendationProps) {
  if (!stage) return null;

  const pool = RECOMMENDATIONS[stage];
  const week = getWeekOfYear();
  const tip = pool[week % pool.length];

  return (
    <section aria-label="Sugerencia de la semana" className="py-8 md:py-12 border-t border-foreground/10">
      <p className="eyebrow mb-5 text-[10px]">Esta semana te sugerimos</p>
      <p
        className="font-serif text-foreground text-balance max-w-3xl leading-snug"
        style={{
          fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)",
          fontWeight: 400,
          letterSpacing: "-0.01em",
        }}
      >
        {tip}
      </p>
    </section>
  );
}

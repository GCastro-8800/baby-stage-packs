import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
  "6-9m": [
    "Dale una cuchara segura para que practique llevársela a la boca.",
    "Juega a esconder un juguete bajo una tela. Buscará debajo.",
    "Llévale al parque y deja que toque el césped y las hojas.",
    "Aplaude sus logros. Tu entusiasmo es su mejor motor.",
  ],
  "9-12m": [
    "Camina con él de la mano. Cada paso cuenta.",
    "Nombra las cosas que señala. Está construyendo vocabulario.",
    "Dale recipientes para meter y sacar cosas. Le fascina.",
    "Baila con él en brazos. La música y el movimiento le estimulan.",
  ],
  "12m+": [
    "Déjale elegir entre dos opciones sencillas. Le da autonomía.",
    "Pinta con los dedos. Ensuciar también es aprender.",
    "Lee juntos cada noche. Será uno de sus mejores recuerdos.",
    "Llévale a conocer texturas nuevas: arena, agua, plastilina.",
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
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="py-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-medium text-sm text-foreground mb-1">
              Consejo de la semana
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tip}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

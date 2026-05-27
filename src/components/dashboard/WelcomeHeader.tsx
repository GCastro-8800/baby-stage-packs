import type { Stage, Situation } from "@/types/baby";

interface WelcomeHeaderProps {
  fullName: string | null | undefined;
  email: string | undefined;
  avatarUrl: string | null | undefined;
  situation: Situation | null;
  ageText: string | null;
  daysUntilBirth: number | null;
  stage: Stage | null;
}

const STAGE_SENTENCE: Record<Stage, string> = {
  prenatal: "Estás preparándote para conocer a tu bebé.",
  "0-3m": "Tu bebé está en sus primeros días.",
  "3-6m": "Tu bebé empieza a descubrir el mundo.",
  "6-9m": "Tu bebé explora todo lo que le rodea.",
  "9-12m": "Tu bebé está cerca de sus primeros pasos.",
  "12m+": "Tu bebé es ya un pequeño aventurero.",
};

export function WelcomeHeader({
  fullName,
  email,
  situation,
  ageText,
  daysUntilBirth,
  stage,
}: WelcomeHeaderProps) {
  const firstName =
    fullName?.split(" ")[0] || email?.split("@")[0] || "bienvenida";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  const subline = (() => {
    if (situation === "expecting" && daysUntilBirth !== null) {
      if (daysUntilBirth <= 0) return "Tu bebé puede llegar en cualquier momento.";
      if (daysUntilBirth === 1) return "Queda 1 día para conocer a tu bebé.";
      return `Quedan ${daysUntilBirth} días para conocer a tu bebé.`;
    }
    if (situation === "born" && stage && ageText) {
      return `${STAGE_SENTENCE[stage]} · ${ageText}`;
    }
    return "Tu espacio para acompañarte en cada Momento.";
  })();

  return (
    <header className="pt-4 pb-8 md:pt-10 md:pb-14">
      <p className="eyebrow mb-5 text-[10px]">Tu espacio</p>
      <h1
        className="font-serif text-foreground text-balance mb-4"
        style={{
          fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
          fontWeight: 400,
          letterSpacing: "-0.015em",
          lineHeight: 1.05,
        }}
      >
        {getGreeting()}, {firstName}.
      </h1>
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {subline}
      </p>
    </header>
  );
}

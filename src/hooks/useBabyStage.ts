import { useMemo } from "react";
import { differenceInDays, differenceInMonths, format } from "date-fns";
import { es } from "date-fns/locale";

type Stage = "prenatal" | "0-3m" | "3-6m" | "6-9m" | "9-12m" | "12m+";
type Situation = "expecting" | "born";

interface Profile {
  parent_situation: string | null;
  is_first_child: boolean | null;
  baby_birth_date: string | null;
  baby_due_date: string | null;
}

interface BabyStageResult {
  // Estado
  situation: Situation | null;
  isFirstChild: boolean | null;

  // Para bebés nacidos
  ageInDays: number | null;
  ageInMonths: number | null;
  ageText: string | null;
  birthDate: Date | null;
  birthDateFormatted: string | null;

  // Para embarazadas
  daysUntilBirth: number | null;
  dueDate: Date | null;
  dueDateFormatted: string | null;

  // Etapa
  stage: Stage | null;
  stageName: string | null;
  stageProgress: number;
  daysInStage: number;
  totalDaysInStage: number;
}

const STAGE_NAMES: Record<Stage, string> = {
  prenatal: "Preparándote",
  "0-3m": "Primeros días",
  "3-6m": "Descubriendo",
  "6-9m": "Explorando",
  "9-12m": "Creciendo",
  "12m+": "Pequeño grande",
};

const STAGE_RANGES: Record<Exclude<Stage, "prenatal" | "12m+">, { start: number; end: number }> = {
  "0-3m": { start: 0, end: 90 },
  "3-6m": { start: 91, end: 180 },
  "6-9m": { start: 181, end: 270 },
  "9-12m": { start: 271, end: 365 },
};

const getStage = (ageInDays: number): Stage => {
  if (ageInDays < 0) return "prenatal";
  if (ageInDays <= 90) return "0-3m";
  if (ageInDays <= 180) return "3-6m";
  if (ageInDays <= 270) return "6-9m";
  if (ageInDays <= 365) return "9-12m";
  return "12m+";
};

const calculateAgeText = (ageInDays: number, ageInMonths: number): string => {
  if (ageInMonths >= 12) {
    const years = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
    if (remainingMonths === 0) {
      return `${years} ${years === 1 ? "año" : "años"}`;
    }
    return `${years} ${years === 1 ? "año" : "años"} y ${remainingMonths} ${remainingMonths === 1 ? "mes" : "meses"}`;
  }
  
  if (ageInMonths > 0) {
    const remainingDays = ageInDays - ageInMonths * 30;
    if (remainingDays <= 0) {
      return `${ageInMonths} ${ageInMonths === 1 ? "mes" : "meses"}`;
    }
    return `${ageInMonths} ${ageInMonths === 1 ? "mes" : "meses"} y ${remainingDays} ${remainingDays === 1 ? "día" : "días"}`;
  }
  
  return `${ageInDays} ${ageInDays === 1 ? "día" : "días"}`;
};

export function useBabyStage(profile: Profile | null): BabyStageResult {
  return useMemo(() => {
    const defaultResult: BabyStageResult = {
      situation: null,
      isFirstChild: null,
      ageInDays: null,
      ageInMonths: null,
      ageText: null,
      birthDate: null,
      birthDateFormatted: null,
      daysUntilBirth: null,
      dueDate: null,
      dueDateFormatted: null,
      stage: null,
      stageName: null,
      stageProgress: 0,
      daysInStage: 0,
      totalDaysInStage: 0,
    };

    if (!profile) return defaultResult;

    const today = new Date();
    const situation = profile.parent_situation as Situation | null;
    const isFirstChild = profile.is_first_child;

    // Para embarazadas
    if (situation === "expecting" && profile.baby_due_date) {
      const dueDate = new Date(profile.baby_due_date);
      const daysUntilBirth = differenceInDays(dueDate, today);

      return {
        ...defaultResult,
        situation,
        isFirstChild,
        daysUntilBirth: Math.max(0, daysUntilBirth),
        dueDate,
        dueDateFormatted: format(dueDate, "d 'de' MMMM yyyy", { locale: es }),
        stage: "prenatal",
        stageName: STAGE_NAMES.prenatal,
        stageProgress: 0,
        daysInStage: 0,
        totalDaysInStage: 0,
      };
    }

    // Para bebés nacidos
    if (situation === "born" && profile.baby_birth_date) {
      const birthDate = new Date(profile.baby_birth_date);
      const ageInDays = differenceInDays(today, birthDate);
      const ageInMonths = differenceInMonths(today, birthDate);
      const stage = getStage(ageInDays);

      // Calculate progress within stage
      let stageProgress = 0;
      let daysInStage = 0;
      let totalDaysInStage = 0;

      if (stage !== "prenatal" && stage !== "12m+") {
        const range = STAGE_RANGES[stage];
        daysInStage = ageInDays - range.start;
        totalDaysInStage = range.end - range.start;
        stageProgress = Math.min(100, Math.max(0, (daysInStage / totalDaysInStage) * 100));
      } else if (stage === "12m+") {
        stageProgress = 100;
        daysInStage = ageInDays - 365;
        totalDaysInStage = 0;
      }

      return {
        ...defaultResult,
        situation,
        isFirstChild,
        ageInDays,
        ageInMonths,
        ageText: calculateAgeText(ageInDays, ageInMonths),
        birthDate,
        birthDateFormatted: format(birthDate, "d 'de' MMMM yyyy", { locale: es }),
        stage,
        stageName: STAGE_NAMES[stage],
        stageProgress,
        daysInStage,
        totalDaysInStage,
      };
    }

    return defaultResult;
  }, [profile]);
}

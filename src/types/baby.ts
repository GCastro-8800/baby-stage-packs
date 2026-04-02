export type AppStage = "prenatal" | "0-3m" | "3-6m" | "6-9m" | "9-12m" | "12m+";
export type DbStage = "prenatal" | "0-3m" | "3-6m" | "6-12m" | "12-18m" | "18-24m";

// Keep Stage as AppStage for backwards compatibility
export type Stage = AppStage;

export type Situation = "expecting" | "born";

export function toDbStage(stage: AppStage): DbStage {
  const map: Record<AppStage, DbStage> = {
    "prenatal": "prenatal",
    "0-3m": "0-3m",
    "3-6m": "3-6m",
    "6-9m": "6-12m",
    "9-12m": "6-12m",
    "12m+": "12-18m",
  };
  return map[stage];
}

export function fromDbStage(dbStage: DbStage): AppStage {
  const map: Record<DbStage, AppStage> = {
    "prenatal": "prenatal",
    "0-3m": "0-3m",
    "3-6m": "3-6m",
    "6-12m": "6-9m",
    "12-18m": "12m+",
    "18-24m": "12m+",
  };
  return map[dbStage];
}

export interface Child {
  id: string;
  user_id: string;
  name: string | null;
  situation: Situation;
  due_date: string | null;
  birth_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  baby_due_date: string | null;
  baby_birth_date: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean | null;
  is_first_child: boolean | null;
  parent_situation: string | null;
  has_seen_tutorial: boolean;
}

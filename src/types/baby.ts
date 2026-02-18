export type Stage = "prenatal" | "0-3m" | "3-6m" | "6-9m" | "9-12m" | "12m+";
export type Situation = "expecting" | "born";

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
}

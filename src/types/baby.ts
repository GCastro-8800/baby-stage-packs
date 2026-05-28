// Stage values aligned with the DB `baby_stage` enum (single source of truth).
export type Stage = "prenatal" | "0-3m" | "3-6m" | "6-12m" | "12-18m" | "18-24m";

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

export interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
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
  phone: string | null;
  phone_verified: boolean;
  notification_preferences: NotificationPreferences;
}

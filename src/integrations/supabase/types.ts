export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          birth_date: string | null
          created_at: string
          due_date: string | null
          id: string
          is_active: boolean
          name: string | null
          situation: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          situation: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_active?: boolean
          name?: string | null
          situation?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          item_key: string
          rating: string
          shipment_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          item_key: string
          rating: string
          shipment_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          item_key?: string
          rating?: string
          shipment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          converted_at: string | null
          created_at: string | null
          email: string
          id: string
          plan: string
          postal_code: string | null
          recovery_email_1_sent_at: string | null
          recovery_email_2_sent_at: string | null
          selected_products: string[] | null
          user_id: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          plan: string
          postal_code?: string | null
          recovery_email_1_sent_at?: string | null
          recovery_email_2_sent_at?: string | null
          selected_products?: string[] | null
          user_id?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          plan?: string
          postal_code?: string | null
          recovery_email_1_sent_at?: string | null
          recovery_email_2_sent_at?: string | null
          selected_products?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          id: string
          ip_address: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          ip_address: string
        }
        Update: {
          attempted_at?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      multichannel_notification_log: {
        Row: {
          channel: string
          created_at: string
          error_message: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          status: string
          subscription_id: string | null
          template_key: string
          user_id: string
        }
        Insert: {
          channel: string
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          status: string
          subscription_id?: string | null
          template_key: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          status?: string
          subscription_id?: string | null
          template_key?: string
          user_id?: string
        }
        Relationships: []
      }
      pickup_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          subscription_id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          subscription_id: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          subscription_id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      processed_stripe_events: {
        Row: {
          event_id: string
          event_type: string
          id: string
          processed_at: string | null
        }
        Insert: {
          event_id: string
          event_type: string
          id?: string
          processed_at?: string | null
        }
        Update: {
          event_id?: string
          event_type?: string
          id?: string
          processed_at?: string | null
        }
        Relationships: []
      }
      product_requests: {
        Row: {
          created_at: string
          email: string | null
          id: string
          notes: string | null
          query: string
          referrer: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          query: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          notes?: string | null
          query?: string
          referrer?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          baby_birth_date: string | null
          baby_due_date: string | null
          created_at: string
          full_name: string | null
          has_seen_tutorial: boolean
          id: string
          is_first_child: boolean | null
          notification_preferences: Json
          onboarding_completed: boolean | null
          parent_situation: string | null
          phone: string | null
          phone_verified: boolean
          questionnaire_answers: Json | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          baby_birth_date?: string | null
          baby_due_date?: string | null
          created_at?: string
          full_name?: string | null
          has_seen_tutorial?: boolean
          id: string
          is_first_child?: boolean | null
          notification_preferences?: Json
          onboarding_completed?: boolean | null
          parent_situation?: string | null
          phone?: string | null
          phone_verified?: boolean
          questionnaire_answers?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          baby_birth_date?: string | null
          baby_due_date?: string | null
          created_at?: string
          full_name?: string | null
          has_seen_tutorial?: boolean
          id?: string
          is_first_child?: boolean | null
          notification_preferences?: Json
          onboarding_completed?: boolean | null
          parent_situation?: string | null
          phone?: string | null
          phone_verified?: boolean
          questionnaire_answers?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_buckets: {
        Row: {
          count: number
          key: string
          updated_at: string
          window_start: string
        }
        Insert: {
          count?: number
          key: string
          updated_at?: string
          window_start?: string
        }
        Update: {
          count?: number
          key?: string
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          created_at: string
          delivered_date: string | null
          id: string
          items: Json
          scheduled_date: string
          shipped_date: string | null
          stage: Database["public"]["Enums"]["baby_stage"]
          status: Database["public"]["Enums"]["shipment_status"]
          subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivered_date?: string | null
          id?: string
          items?: Json
          scheduled_date: string
          shipped_date?: string | null
          stage: Database["public"]["Enums"]["baby_stage"]
          status?: Database["public"]["Enums"]["shipment_status"]
          subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivered_date?: string | null
          id?: string
          items?: Json
          scheduled_date?: string
          shipped_date?: string | null
          stage?: Database["public"]["Enums"]["baby_stage"]
          status?: Database["public"]["Enums"]["shipment_status"]
          subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_stage: Database["public"]["Enums"]["baby_stage"]
          end_date: string | null
          id: string
          next_shipment_date: string | null
          pickup_scheduled_date: string | null
          pickup_status: string
          pickup_window: string | null
          plan_name: string
          shipping_address: Json | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stage?: Database["public"]["Enums"]["baby_stage"]
          end_date?: string | null
          id?: string
          next_shipment_date?: string | null
          pickup_scheduled_date?: string | null
          pickup_status?: string
          pickup_window?: string | null
          plan_name?: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stage?: Database["public"]["Enums"]["baby_stage"]
          end_date?: string | null
          id?: string
          next_shipment_date?: string | null
          pickup_scheduled_date?: string | null
          pickup_status?: string
          pickup_window?: string | null
          plan_name?: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_selections: {
        Row: {
          durations: Json
          product_ids: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          durations?: Json
          product_ids?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          durations?: Json
          product_ids?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: { _key: string; _max: number; _window_seconds: number }
        Returns: Json
      }
      cleanup_old_login_attempts: { Args: never; Returns: undefined }
      cleanup_rate_limit_buckets: { Args: never; Returns: undefined }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_inactive_customers: {
        Args: { _months?: number }
        Returns: {
          full_name: string
          id: string
          last_activity: string
          last_status: string
        }[]
      }
      get_user_subscription_overview: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "user" | "admin"
      baby_stage: "prenatal" | "0-3m" | "3-6m" | "6-12m" | "12-18m" | "18-24m"
      shipment_status: "scheduled" | "packed" | "shipped" | "delivered"
      subscription_status: "active" | "paused" | "cancelled" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin"],
      baby_stage: ["prenatal", "0-3m", "3-6m", "6-12m", "12-18m", "18-24m"],
      shipment_status: ["scheduled", "packed", "shipped", "delivered"],
      subscription_status: ["active", "paused", "cancelled", "expired"],
    },
  },
} as const

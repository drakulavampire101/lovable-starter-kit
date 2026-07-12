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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      candidate_profiles: {
        Row: {
          created_at: string
          id: string
          overall_score: number
          overridden_by: string | null
          override_reason: string | null
          rank: number | null
          round_id: string
          scores: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          overall_score?: number
          overridden_by?: string | null
          override_reason?: string | null
          rank?: number | null
          round_id: string
          scores?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          overall_score?: number
          overridden_by?: string | null
          override_reason?: string | null
          rank?: number | null
          round_id?: string
          scores?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_profiles_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "recommendation_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_history: {
        Row: {
          action: string
          actor_id: string | null
          complaint_id: string
          created_at: string
          id: string
          notes: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          complaint_id: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          complaint_id?: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_images: {
        Row: {
          complaint_id: string
          created_at: string
          id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          complaint_id: string
          created_at?: string
          id?: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          complaint_id?: string
          created_at?: string
          id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_images_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          anonymous: boolean
          category: Database["public"]["Enums"]["complaint_category"]
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["complaint_status"]
          updated_at: string
          user_id: string
          warning_level: number
        }
        Insert: {
          anonymous?: boolean
          category: Database["public"]["Enums"]["complaint_category"]
          created_at?: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
          user_id: string
          warning_level?: number
        }
        Update: {
          anonymous?: boolean
          category?: Database["public"]["Enums"]["complaint_category"]
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string
          user_id?: string
          warning_level?: number
        }
        Relationships: []
      }
      election_candidates: {
        Row: {
          created_at: string
          election_id: string
          id: string
          manifesto: string | null
          slogan: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          election_id: string
          id?: string
          manifesto?: string | null
          slogan?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          election_id?: string
          id?: string
          manifesto?: string | null
          slogan?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "election_candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      election_timeline: {
        Row: {
          actor_id: string | null
          created_at: string
          election_id: string
          event: string
          id: string
          notes: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          election_id: string
          event: string
          id?: string
          notes?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          election_id?: string
          event?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "election_timeline_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      elections: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          ends_at: string | null
          id: string
          starts_at: string | null
          status: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["election_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["election_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read: boolean
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_color: string | null
          class_name: string | null
          created_at: string
          dob: string | null
          hearing: string | null
          height: number | null
          id: string
          name: string
          roll_number: string
          section: string | null
          updated_at: string
          vision: string | null
        }
        Insert: {
          avatar_color?: string | null
          class_name?: string | null
          created_at?: string
          dob?: string | null
          hearing?: string | null
          height?: number | null
          id: string
          name: string
          roll_number: string
          section?: string | null
          updated_at?: string
          vision?: string | null
        }
        Update: {
          avatar_color?: string | null
          class_name?: string | null
          created_at?: string
          dob?: string | null
          hearing?: string | null
          height?: number | null
          id?: string
          name?: string
          roll_number?: string
          section?: string | null
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          anonymous: boolean
          categories: Json
          comment: string | null
          created_at: string
          id: string
          overall: number
          rater_id: string
          status: Database["public"]["Enums"]["rating_status"]
          target_id: string
          updated_at: string
        }
        Insert: {
          anonymous?: boolean
          categories?: Json
          comment?: string | null
          created_at?: string
          id?: string
          overall?: number
          rater_id: string
          status?: Database["public"]["Enums"]["rating_status"]
          target_id: string
          updated_at?: string
        }
        Update: {
          anonymous?: boolean
          categories?: Json
          comment?: string | null
          created_at?: string
          id?: string
          overall?: number
          rater_id?: string
          status?: Database["public"]["Enums"]["rating_status"]
          target_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      recommendation_history: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          notes: string | null
          round_id: string
          user_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          round_id: string
          user_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          round_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_history_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "recommendation_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_rounds: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          name: string
          status: string
          updated_at: string
          weights: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          weights?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          weights?: Json
        }
        Relationships: []
      }
      seat_assignments: {
        Row: {
          col_num: number
          id: string
          locked: boolean
          plan_id: string
          row_num: number
          student_id: string | null
        }
        Insert: {
          col_num: number
          id?: string
          locked?: boolean
          plan_id: string
          row_num: number
          student_id?: string | null
        }
        Update: {
          col_num?: number
          id?: string
          locked?: boolean
          plan_id?: string
          row_num?: number
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_assignments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "seat_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_roster"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_constraints: {
        Row: {
          created_at: string
          id: string
          kind: string
          meta: Json | null
          plan_id: string
          student_a: string | null
          student_b: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          meta?: Json | null
          plan_id: string
          student_a?: string | null
          student_b?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          meta?: Json | null
          plan_id?: string
          student_a?: string | null
          student_b?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seat_constraints_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "seat_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_constraints_student_a_fkey"
            columns: ["student_a"]
            isOneToOne: false
            referencedRelation: "students_roster"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_constraints_student_b_fkey"
            columns: ["student_b"]
            isOneToOne: false
            referencedRelation: "students_roster"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_plans: {
        Row: {
          created_at: string
          created_by: string | null
          grid_cols: number
          grid_rows: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          grid_cols?: number
          grid_rows?: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          grid_cols?: number
          grid_rows?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          id: string
          location: string
          message: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["sos_severity"]
          status: Database["public"]["Enums"]["sos_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: string
          location: string
          message?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["sos_severity"]
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          id?: string
          location?: string
          message?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["sos_severity"]
          status?: Database["public"]["Enums"]["sos_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sos_claims: {
        Row: {
          action: string
          alert_id: string
          created_at: string
          id: string
          notes: string | null
          responder_id: string
        }
        Insert: {
          action: string
          alert_id: string
          created_at?: string
          id?: string
          notes?: string | null
          responder_id: string
        }
        Update: {
          action?: string
          alert_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          responder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sos_claims_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "sos_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      strikes: {
        Row: {
          count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students_roster: {
        Row: {
          created_at: string
          hearing: string | null
          height: number | null
          id: string
          name: string
          notes: string | null
          roll_number: string
          updated_at: string
          vision: string | null
        }
        Insert: {
          created_at?: string
          hearing?: string | null
          height?: number | null
          id?: string
          name: string
          notes?: string | null
          roll_number: string
          updated_at?: string
          vision?: string | null
        }
        Update: {
          created_at?: string
          hearing?: string | null
          height?: number | null
          id?: string
          name?: string
          notes?: string | null
          roll_number?: string
          updated_at?: string
          vision?: string | null
        }
        Relationships: []
      }
      tiffin_budgets: {
        Row: {
          amount: number
          id: string
          period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          period?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tiffin_menu: {
        Row: {
          available: boolean
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          available?: boolean
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          available?: boolean
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      tiffin_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          menu_id: string | null
          notes: string | null
          quantity: number
          type: Database["public"]["Enums"]["tiffin_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          menu_id?: string | null
          notes?: string | null
          quantity?: number
          type?: Database["public"]["Enums"]["tiffin_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          menu_id?: string | null
          notes?: string | null
          quantity?: number
          type?: Database["public"]["Enums"]["tiffin_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiffin_transactions_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "tiffin_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_flags: {
        Row: {
          active: boolean
          created_at: string
          flagged_by: string | null
          id: string
          kind: string
          reason: string | null
          updated_at: string
          user_id: string
          weight: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          flagged_by?: string | null
          id?: string
          kind: string
          reason?: string | null
          updated_at?: string
          user_id: string
          weight?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          flagged_by?: string | null
          id?: string
          kind?: string
          reason?: string | null
          updated_at?: string
          user_id?: string
          weight?: number
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
          role: Database["public"]["Enums"]["app_role"]
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
      votes: {
        Row: {
          candidate_id: string
          created_at: string
          election_id: string
          id: string
          voter_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          election_id: string
          id?: string
          voter_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          election_id?: string
          id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "election_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "election_tally"
            referencedColumns: ["candidate_id"]
          },
          {
            foreignKeyName: "votes_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      election_tally: {
        Row: {
          candidate_id: string | null
          election_id: string | null
          user_id: string | null
          vote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "election_candidates_election_id_fkey"
            columns: ["election_id"]
            isOneToOne: false
            referencedRelation: "elections"
            referencedColumns: ["id"]
          },
        ]
      }
      rating_leaderboard: {
        Row: {
          avg_score: number | null
          ratings_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
      trust_scores: {
        Row: {
          flag_count: number | null
          score: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "STUDENT" | "CAPTAIN" | "TEACHER" | "OFFICE"
      complaint_category: "TIFFIN_THEFT" | "BRIBE" | "LARGE_SYLLABUS" | "OTHER"
      complaint_status: "PENDING" | "REVIEWED" | "RESOLVED"
      election_status: "DRAFT" | "ACTIVE" | "CLOSED"
      rating_status: "PENDING" | "APPROVED" | "REJECTED"
      sos_severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      sos_status: "ACTIVE" | "CLAIMED" | "RESOLVED"
      tiffin_type: "PURCHASE" | "REFUND" | "ADJUSTMENT"
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
      app_role: ["STUDENT", "CAPTAIN", "TEACHER", "OFFICE"],
      complaint_category: ["TIFFIN_THEFT", "BRIBE", "LARGE_SYLLABUS", "OTHER"],
      complaint_status: ["PENDING", "REVIEWED", "RESOLVED"],
      election_status: ["DRAFT", "ACTIVE", "CLOSED"],
      rating_status: ["PENDING", "APPROVED", "REJECTED"],
      sos_severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      sos_status: ["ACTIVE", "CLAIMED", "RESOLVED"],
      tiffin_type: ["PURCHASE", "REFUND", "ADJUSTMENT"],
    },
  },
} as const

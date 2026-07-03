export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          email: string | null;
          role: string;
          plan: string;
          avatar_url: string | null;
          status: string;
          last_login_at: string | null;
          currency: string;
          alert_mode: string;
          risk_profile: string;
          theme: string;
          monthly_budget: number | null;
          weekly_budget: number | null;
          variable_budget: number | null;
          monthly_savings_goal: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

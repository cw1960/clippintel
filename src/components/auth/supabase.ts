// ClippIntell Bot Detection MVP - Supabase Configuration

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema types for Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          subscription_tier: string;
          monthly_analysis_limit: number;
          analysis_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          subscription_tier?: string;
          monthly_analysis_limit?: number;
          analysis_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          subscription_tier?: string;
          monthly_analysis_limit?: number;
          analysis_count?: number;
          updated_at?: string;
        };
      };
      bot_analyses: {
        Row: {
          id: string;
          user_id: string;
          account_handle: string;
          platform: string;
          bot_score: number;
          risk_level: string;
          signals: any;
          metrics: any;
          red_flags: string[];
          recommendations: string[];
          confidence: number;
          processing_time: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_handle: string;
          platform: string;
          bot_score: number;
          risk_level: string;
          signals: any;
          metrics: any;
          red_flags?: string[];
          recommendations?: string[];
          confidence: number;
          processing_time: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_handle?: string;
          platform?: string;
          bot_score?: number;
          risk_level?: string;
          signals?: any;
          metrics?: any;
          red_flags?: string[];
          recommendations?: string[];
          confidence?: number;
          processing_time?: number;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          total_analyses: number;
          high_risk_accounts: number;
          average_bot_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          total_analyses?: number;
          high_risk_accounts?: number;
          average_bot_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          total_analyses?: number;
          high_risk_accounts?: number;
          average_bot_score?: number;
          updated_at?: string;
        };
      };
    };
  };
}

// Auth helper functions
export const authHelpers = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },
  
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};
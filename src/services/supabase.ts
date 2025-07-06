import { createClient } from "@supabase/supabase-js";

// Default configuration - should be overridden by environment variables
const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Initialize Supabase client
export const supabase = createClient(
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
);

// Utility functions for common operations
export const supabaseUtils = {
  // Authentication
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },
};

export default supabase;

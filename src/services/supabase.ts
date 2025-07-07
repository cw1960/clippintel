import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '../types/user';

// Supabase configuration with provided credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://joxzubnkgelzxoyzotbt.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveHp1Ym5rZ2VsenhveXpvdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4Mzg1ODQsImV4cCI6MjA2NzQxNDU4NH0.3oTCzc1g_G7-QCrEkYDgj2US4z2olyd6A7X-jlpcUoI';

// Initialize Supabase client
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Types for better TypeScript support
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: any;
}

// UserProfile imported from types/user.ts

export interface OpportunityRecord {
  id: string;
  user_id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
  value?: number;
  currency?: string;
  deadline?: string;
  status: 'new' | 'reviewed' | 'applied' | 'rejected' | 'accepted';
  match_score: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Authentication helper functions
export const authHelpers = {
  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, userData?: { full_name?: string }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) throw error;

      // Create user profile if signup successful
      if (data.user && !error) {
        await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: userData?.full_name || '',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  },

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error };
    }
  },

  /**
   * Get current session
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error };
    }
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  },

  /**
   * Update password
   */
  async updatePassword(password: string) {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Database helper functions
export const dbHelpers = {
  /**
   * Get user profile
   */
  async getUserProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user profile error:', error);
      return { data: null, error };
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get opportunities for user
   */
  async getOpportunities(userId: string, filters?: {
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('opportunities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get opportunities error:', error);
      return { data: null, error };
    }
  },

  /**
   * Create opportunity
   */
  async createOpportunity(opportunity: Omit<OpportunityRecord, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert({
          ...opportunity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create opportunity error:', error);
      return { data: null, error };
    }
  },

  /**
   * Update opportunity
   */
  async updateOpportunity(id: string, updates: Partial<OpportunityRecord>) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update opportunity error:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete opportunity
   */
  async deleteOpportunity(id: string) {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Delete opportunity error:', error);
      return { error };
    }
  },

  /**
   * Get user criteria
   */
  async getUserCriteria(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_criteria')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user criteria error:', error);
      return { data: null, error };
    }
  },

  /**
   * Create user criteria
   */
  async createUserCriteria(criteria: {
    user_id: string;
    name: string;
    description: string;
    keywords: string[];
    categories: string[];
    min_value?: number;
    max_value?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('user_criteria')
        .insert({
          ...criteria,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create user criteria error:', error);
      return { data: null, error };
    }
  },
};

// Real-time subscriptions
export const realtimeHelpers = {
  /**
   * Subscribe to opportunities changes
   */
  subscribeToOpportunities(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('opportunities')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  /**
   * Subscribe to user profile changes
   */
  subscribeToUserProfile(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('user_profile')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  /**
   * Unsubscribe from channel
   */
  unsubscribe(channel: any) {
    return supabase.removeChannel(channel);
  },
};

// Utility functions
export const supabaseUtils = {
  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { session } = await authHelpers.getCurrentSession();
    return !!session;
  },

  /**
   * Get authenticated user with profile
   */
  async getAuthenticatedUserWithProfile() {
    try {
      const { user, error: userError } = await authHelpers.getCurrentUser();
      if (userError || !user) return { user: null, profile: null, error: userError };

      const { data: profile, error: profileError } = await dbHelpers.getUserProfile(user.id);
      if (profileError) return { user, profile: null, error: profileError };

      return { user, profile, error: null };
    } catch (error) {
      console.error('Get authenticated user with profile error:', error);
      return { user: null, profile: null, error };
    }
  },

  /**
   * Upload file to storage
   */
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Upload file error:', error);
      return { data: null, error };
    }
  },

  /**
   * Get public URL for file
   */
  getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
};

export default supabase; 
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authHelpers, dbHelpers, supabaseUtils } from '../services/supabase';
import type {
  AuthStore,
  UserProfile,
  UserPreferences
} from '../types/user';

// Helper function to safely extract error messages
const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

// Default user preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  date_format: 'MM/DD/YYYY',
  time_format: '12h',
  currency: 'USD',
  notifications: {
    email_enabled: true,
    email_frequency: 'daily',
    email_types: {
      new_opportunities: true,
      opportunity_updates: true,
      system_alerts: true,
      marketing: false,
      security: true,
      digest: true,
    },
    in_app_enabled: true,
    in_app_types: {
      new_opportunities: true,
      opportunity_updates: true,
      system_alerts: true,
      team_activities: true,
      mentions: true,
    },
    push_enabled: false,
    push_types: {
      urgent_opportunities: false,
      deadline_reminders: false,
      system_alerts: false,
    },
    sms_enabled: false,
    sms_types: {
      urgent_opportunities: false,
      security_alerts: false,
      deadline_reminders: false,
    },
    quiet_hours: {
      enabled: false,
      start_time: '22:00',
      end_time: '08:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    preferred_channels: ['email', 'in_app'],
  },
  features: {
    dashboard: {
      default_view: 'grid',
      items_per_page: 20,
      auto_refresh: true,
      refresh_interval: 300,
      show_analytics: true,
      show_charts: true,
    },
    opportunities: {
      auto_match: true,
      match_threshold: 75,
      auto_apply: false,
      auto_save: true,
      default_sort: 'newest',
      default_filters: [],
      show_expired: false,
    },
    analytics: {
      track_clicks: true,
      track_applications: true,
      track_time_spent: false,
      share_anonymous_data: false,
    },
    collaboration: {
      share_opportunities: false,
      team_notifications: true,
      public_profile: false,
    },
  },
  privacy: {
    profile_visibility: 'private',
    activity_visibility: 'private',
    search_visibility: false,
    data_retention: 'auto',
    third_party_integrations: false,
    analytics_tracking: false,
    marketing_communications: false,
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      session: null,
      loading: false,
      initialized: false,
      error: null,

      // Authentication Actions
      signUp: async (email: string, password: string, userData?: { full_name?: string }) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await authHelpers.signUp(email, password, userData);
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          if (data?.user && data?.session) {
            set({ 
              user: data.user, 
              session: data.session, 
              loading: false,
              error: null 
            });

            // Load user profile
            await get().loadUserProfile();
            
            return { success: true };
          }

          set({ loading: false });
          return { success: false, error: 'No user data returned' };
        } catch (error) {
          console.error('Sign up error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await authHelpers.signIn(email, password);
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          if (data?.user && data?.session) {
            set({ 
              user: data.user, 
              session: data.session, 
              loading: false,
              error: null 
            });

            // Load user profile
            await get().loadUserProfile();
            
            return { success: true };
          }

          set({ loading: false });
          return { success: false, error: 'Invalid credentials' };
        } catch (error) {
          console.error('Sign in error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await authHelpers.signOut();
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          set({ 
            user: null, 
            profile: null, 
            session: null, 
            loading: false,
            error: null 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Sign out error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      resetPassword: async (email: string) => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await authHelpers.resetPassword(email);
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          set({ loading: false });
          return { success: true };
        } catch (error) {
          console.error('Reset password error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      updatePassword: async (password: string) => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await authHelpers.updatePassword(password);
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          set({ loading: false });
          return { success: true };
        } catch (error) {
          console.error('Update password error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      // Profile Management
      updateProfile: async (updates: Partial<UserProfile>) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        set({ loading: true, error: null });
        
        try {
          const { data, error } = await dbHelpers.updateUserProfile(user.id, updates);
          
          if (error) {
            set({ error: getErrorMessage(error), loading: false });
            return { success: false, error };
          }

          if (data) {
            set({ profile: data, loading: false });
            return { success: true };
          }

          set({ loading: false });
          return { success: false, error: 'No profile data returned' };
        } catch (error) {
          console.error('Update profile error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      uploadAvatar: async (file: File) => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        set({ loading: true, error: null });
        
        try {
          // Upload file to Supabase storage
          const fileName = `avatars/${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabaseUtils.uploadFile(
            'avatars', 
            fileName, 
            file
          );
          
          if (uploadError) {
            set({ error: getErrorMessage(uploadError), loading: false });
            return { success: false, error: uploadError };
          }

          // Get public URL
          const avatarUrl = supabaseUtils.getPublicUrl('avatars', fileName);
          
          // Update profile with new avatar URL
          const updateResult = await get().updateProfile({ avatar_url: avatarUrl });
          
          if (updateResult.success) {
            set({ loading: false });
            return { success: true, url: avatarUrl };
          }

          return updateResult;
        } catch (error) {
          console.error('Upload avatar error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      deleteAccount: async () => {
        const { user } = get();
        if (!user) return { success: false, error: 'Not authenticated' };

        set({ loading: true, error: null });
        
        try {
          // Note: This would need to be implemented on the server side
          // as Supabase doesn't provide direct user deletion from client
          console.warn('Account deletion not implemented - requires server-side logic');
          
          set({ loading: false });
          return { success: false, error: 'Account deletion not available from client' };
        } catch (error) {
          console.error('Delete account error:', error);
          set({ error: 'An unexpected error occurred', loading: false });
          return { success: false, error };
        }
      },

      // Preferences
      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        const { profile } = get();
        if (!profile) return { success: false, error: 'No profile found' };

        const updatedPreferences = { ...profile.preferences, ...preferences };
        
        return await get().updateProfile({ 
          preferences: updatedPreferences 
        });
      },

      // Session Management
      refreshSession: async () => {
        try {
          const { session, error } = await authHelpers.getCurrentSession();
          
          if (error) {
            console.error('Refresh session error:', error);
            set({ user: null, session: null, profile: null });
            return;
          }

          if (session) {
            const { user, error: userError } = await authHelpers.getCurrentUser();
            
            if (userError || !user) {
              console.error('Get user error:', userError);
              set({ user: null, session: null, profile: null });
              return;
            }

            set({ user, session });
            await get().loadUserProfile();
          } else {
            set({ user: null, session: null, profile: null });
          }
        } catch (error) {
          console.error('Refresh session error:', error);
          set({ user: null, session: null, profile: null });
        }
      },

      checkAuthStatus: async () => {
        set({ loading: true });
        
        try {
          const { user, profile, error } = await supabaseUtils.getAuthenticatedUserWithProfile();
          
          if (error) {
            console.error('Check auth status error:', error);
            set({ 
              user: null, 
              profile: null, 
              session: null, 
              loading: false, 
              initialized: true 
            });
            return;
          }

          if (user && profile) {
            const { session } = await authHelpers.getCurrentSession();
            set({ 
              user, 
              profile, 
              session, 
              loading: false, 
              initialized: true 
            });
          } else {
            set({ 
              user: null, 
              profile: null, 
              session: null, 
              loading: false, 
              initialized: true 
            });
          }
        } catch (error) {
          console.error('Check auth status error:', error);
          set({ 
            user: null, 
            profile: null, 
            session: null, 
            loading: false, 
            initialized: true,
            error: 'Failed to check authentication status'
          });
        }
      },

      // Utility methods
      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      // Internal helper methods
      loadUserProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile, error } = await dbHelpers.getUserProfile(user.id);
          
          if (error) {
            console.error('Load user profile error:', error);
            // If profile doesn't exist, create a default one
            if (error.code === 'PGRST116') {
              await get().createDefaultProfile(user);
            }
            return;
          }

          if (profile) {
            set({ profile });
          }
        } catch (error) {
          console.error('Load user profile error:', error);
        }
      },

      createDefaultProfile: async (user: any) => {
        try {
          const defaultProfile: Partial<UserProfile> = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            role: 'user',
            subscription_status: 'free',
            email_verified: user.email_confirmed_at ? true : false,
            phone_verified: false,
            onboarding_completed: false,
            preferences: DEFAULT_PREFERENCES,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { data, error } = await dbHelpers.updateUserProfile(user.id, defaultProfile);
          
          if (error) {
            console.error('Create default profile error:', error);
            return;
          }

          if (data) {
            set({ profile: data });
          }
        } catch (error) {
          console.error('Create default profile error:', error);
        }
      },
    }),
    {
      name: 'clippintell-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        session: state.session,
        initialized: state.initialized,
      }),
    }
  )
);

// Initialize auth state on app start
export const initializeAuth = async () => {
  const { checkAuthStatus } = useAuthStore.getState();
  await checkAuthStatus();

  // Set up auth state change listener
  authHelpers.onAuthStateChange(async (event, session) => {
    console.log('Auth state change:', event, session);
    
    const { refreshSession } = useAuthStore.getState();
    await refreshSession();
  });
};

// Utility functions for components
export const useAuth = () => {
  const store = useAuthStore();
  
  return {
    ...store,
    isAuthenticated: !!store.user && !!store.session,
    isLoading: store.loading,
    isInitialized: store.initialized,
    hasProfile: !!store.profile,
    userRole: store.profile?.role || 'user',
    subscriptionStatus: store.profile?.subscription_status || 'free',
  };
};

// Export store for direct access
export default useAuthStore; 
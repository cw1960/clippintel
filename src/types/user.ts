import type { User, Session } from '@supabase/supabase-js';

// Base User Types from Supabase
export type AuthUser = User;
export type AuthSession = Session;

// User Role Types
export type UserRole = 'user' | 'admin' | 'premium' | 'enterprise';

// User Profile Interface
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  website?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  role: UserRole;
  subscription_status: 'free' | 'trial' | 'premium' | 'enterprise';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  email_verified: boolean;
  phone_verified: boolean;
  onboarding_completed: boolean;
  preferences: UserPreferences;
  team_id?: string;
  team_role?: 'member' | 'admin' | 'owner';
}

// User Preferences Interface
export interface UserPreferences {
  // UI Preferences
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';
  timezone: string;
  date_format: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  time_format: '12h' | '24h';
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
  
  // Notification Preferences
  notifications: NotificationPreferences;
  
  // Feature Preferences
  features: FeaturePreferences;
  
  // Privacy Preferences
  privacy: PrivacyPreferences;
}

// Notification Preferences Interface
export interface NotificationPreferences {
  // Email Notifications
  email_enabled: boolean;
  email_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  email_types: {
    new_opportunities: boolean;
    opportunity_updates: boolean;
    system_alerts: boolean;
    marketing: boolean;
    security: boolean;
    digest: boolean;
  };
  
  // In-App Notifications
  in_app_enabled: boolean;
  in_app_types: {
    new_opportunities: boolean;
    opportunity_updates: boolean;
    system_alerts: boolean;
    team_activities: boolean;
    mentions: boolean;
  };
  
  // Push Notifications (for mobile)
  push_enabled: boolean;
  push_types: {
    urgent_opportunities: boolean;
    deadline_reminders: boolean;
    system_alerts: boolean;
  };
  
  // SMS Notifications
  sms_enabled: boolean;
  sms_types: {
    urgent_opportunities: boolean;
    security_alerts: boolean;
    deadline_reminders: boolean;
  };
  
  // Notification Schedule
  quiet_hours: {
    enabled: boolean;
    start_time: string; // HH:MM format
    end_time: string; // HH:MM format
    timezone: string;
  };
  
  // Channels
  preferred_channels: NotificationChannel[];
}

// Feature Preferences Interface
export interface FeaturePreferences {
  dashboard: {
    default_view: 'grid' | 'list' | 'kanban';
    items_per_page: number;
    auto_refresh: boolean;
    refresh_interval: number; // seconds
    show_analytics: boolean;
    show_charts: boolean;
  };
  
  opportunities: {
    auto_match: boolean;
    match_threshold: number; // 0-100
    auto_apply: boolean;
    auto_save: boolean;
    default_sort: 'newest' | 'oldest' | 'match_score' | 'deadline' | 'value';
    default_filters: string[];
    show_expired: boolean;
  };
  
  analytics: {
    track_clicks: boolean;
    track_applications: boolean;
    track_time_spent: boolean;
    share_anonymous_data: boolean;
  };
  
  collaboration: {
    share_opportunities: boolean;
    team_notifications: boolean;
    public_profile: boolean;
  };
}

// Privacy Preferences Interface
export interface PrivacyPreferences {
  profile_visibility: 'public' | 'team' | 'private';
  activity_visibility: 'public' | 'team' | 'private';
  search_visibility: boolean;
  data_retention: 'auto' | 'manual';
  third_party_integrations: boolean;
  analytics_tracking: boolean;
  marketing_communications: boolean;
}

// User Criteria Interface
export interface UserCriteria {
  id: string;
  user_id: string;
  name: string;
  description: string;
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Matching Criteria
  keywords: string[];
  excluded_keywords: string[];
  categories: string[];
  excluded_categories: string[];
  sources: string[];
  excluded_sources: string[];
  
  // Value Filters
  min_value?: number;
  max_value?: number;
  currency?: string;
  
  // Location Filters
  locations: string[];
  excluded_locations: string[];
  remote_ok: boolean;
  
  // Time Filters
  min_deadline_days?: number;
  max_deadline_days?: number;
  posting_date_range?: {
    start?: string;
    end?: string;
  };
  
  // Advanced Filters
  experience_level: ('entry' | 'mid' | 'senior' | 'executive')[];
  company_size: ('startup' | 'small' | 'medium' | 'large' | 'enterprise')[];
  industry: string[];
  
  // Notification Settings
  notification_enabled: boolean;
  notification_frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  notification_channels: NotificationChannel[];
  
  // Metadata
  created_at: string;
  updated_at: string;
  last_match_at?: string;
  match_count: number;
}

// Team and Collaboration Types
export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  owner_id: string;
  subscription_tier: 'free' | 'premium' | 'enterprise';
  settings: TeamSettings;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'member' | 'admin' | 'owner';
  permissions: TeamPermission[];
  invited_by: string;
  joined_at: string;
  invited_at: string;
  status: 'pending' | 'active' | 'suspended';
}

export interface TeamSettings {
  opportunity_sharing: boolean;
  auto_assign_opportunities: boolean;
  require_approval_for_applications: boolean;
  allow_external_sharing: boolean;
  default_notification_settings: NotificationPreferences;
  integrations: {
    slack?: { webhook_url: string; channel: string };
    discord?: { webhook_url: string; channel: string };
    teams?: { webhook_url: string; channel: string };
  };
}

export type TeamPermission = 
  | 'view_opportunities'
  | 'create_opportunities'
  | 'edit_opportunities'
  | 'delete_opportunities'
  | 'manage_criteria'
  | 'view_analytics'
  | 'manage_team'
  | 'manage_integrations'
  | 'manage_billing';

export type NotificationChannel = 
  | 'email'
  | 'in_app'
  | 'push'
  | 'sms'
  | 'slack'
  | 'discord'
  | 'teams'
  | 'webhook';

// Authentication State Types
export interface AuthState {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: AuthSession | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

// Authentication Actions
export interface AuthActions {
  // Authentication
  signUp: (email: string, password: string, userData?: { full_name?: string }) => Promise<{ success: boolean; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: any }>;
  
  // Profile Management
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: any }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; url?: string; error?: any }>;
  deleteAccount: () => Promise<{ success: boolean; error?: any }>;
  
  // Preferences
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ success: boolean; error?: any }>;
  
  // Session Management
  refreshSession: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  
  // Internal helper methods
  loadUserProfile: () => Promise<void>;
  createDefaultProfile: (user: any) => Promise<void>;
}

// Form Types for Authentication
export interface SignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  terms_accepted: boolean;
  marketing_consent: boolean;
}

export interface SignInForm {
  email: string;
  password: string;
  remember_me: boolean;
}

export interface ResetPasswordForm {
  email: string;
}

export interface UpdatePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ProfileUpdateForm {
  full_name?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  website?: string;
  bio?: string;
  location?: string;
  timezone?: string;
}

// API Response Types
export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  profile?: UserProfile;
  session?: AuthSession;
  error?: any;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: UserProfile;
  error?: any;
  message?: string;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Export combined auth store type
export type AuthStore = AuthState & AuthActions; 
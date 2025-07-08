// Types matching your existing Supabase tables
export interface User {
    id: string
    email: string
    full_name?: string
    whop_username?: string
    created_at?: string
    updated_at?: string
    subscription_tier?: 'free' | 'premium'
    onboarding_completed?: boolean
    last_active_at?: string
  }
  
  export interface UserCriteria {
    id: string
    user_id: string
    min_payout: number
    max_payout?: number
    content_types: string[]
    categories: string[]
    excluded_brands: string[]
    excluded_keywords: string[]
    included_keywords: string[]
    max_difficulty: number
    availability_hours: number
    preferred_deadlines: number
    created_at?: string
    updated_at?: string
    is_active: boolean
  }
  
  export interface NotificationPreferences {
    email: boolean
    telegram: boolean
    discord: boolean
    slack: boolean
    frequency: 'instant' | 'daily' | 'weekly'
    quiet_hours_start?: string
    quiet_hours_end?: string
  }
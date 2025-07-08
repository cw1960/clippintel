export interface Opportunity {
    id: string
    whop_id: string // For building the clickable link
    title: string
    description: string
    payout: number
    category: string
    content_type: 'content_clipping' | 'ugc' // Simplified - no hybrid!
    brand: string
    requirements: string[]
    skills_required: string[]
    equipment_needed: string[]
    
    // Essential fields for users:
    whop_url: string // Direct link to apply
    deadline: string
    estimated_hours: number
    applicant_count?: number
    difficulty: 1 | 2 | 3 | 4 | 5 // 1=easy, 5=expert
    
    // Content-type specific (optional):
    video_format?: string[] // ["TikTok", "Instagram Reels"]
    platform_requirements?: string[] // ["Instagram", "TikTok"]
    follower_requirement?: number
    
    match_score: number
    created_at: string
    discovered_at: string
  }
  
  export interface OpportunityFilter {
    category?: string
    content_type?: 'content_clipping' | 'ugc'
    min_payout?: number
    max_payout?: number
    search?: string
    difficulty?: number
    min_match_score?: number
  }
  
  // For user preferences/criteria
  export interface UserCriteria {
    content_types: ('content_clipping' | 'ugc')[]
    min_payout: number
    max_payout?: number
    categories: string[]
    max_difficulty: number
    excluded_brands: string[]
    included_keywords: string[]
    excluded_keywords: string[]
  }
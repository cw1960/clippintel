export interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  category: string;
  value?: number;
  currency?: string;
  deadline?: Date;
  status: OpportunityStatus;
  matchScore: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;

  // Additional metadata
  metadata?: {
    location?: string;
    organization?: string;
    requirements?: string[];
    benefits?: string[];
    eligibility?: string[];
    applicationProcess?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
  };
}

export type OpportunityStatus =
  | "new"
  | "reviewed"
  | "applied"
  | "rejected"
  | "accepted"
  | "expired"
  | "archived";

export interface OpportunityFilter {
  category?: string | null;
  status?: OpportunityStatus | null;
  minScore?: number;
  maxScore?: number;
  minValue?: number;
  maxValue?: number;
  currency?: string;
  searchTerm?: string;
  tags?: string[];
  source?: string;
  deadline?: {
    from?: Date;
    to?: Date;
  };
  location?: string;
  organization?: string;
}

export interface OpportunitySort {
  field:
    | "title"
    | "matchScore"
    | "value"
    | "deadline"
    | "createdAt"
    | "updatedAt";
  direction: "asc" | "desc";
}

export interface OpportunitySearchResult {
  opportunities: Opportunity[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface OpportunityMatchCriteria {
  id: string;
  userId: string;
  name: string;
  description: string;
  keywords: string[];
  categories: string[];
  minValue?: number;
  maxValue?: number;
  currency?: string;
  excludeKeywords?: string[];
  excludeCategories?: string[];
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityMatch {
  opportunityId: string;
  criteriaId: string;
  score: number;
  matchedKeywords: string[];
  matchedCategories: string[];
  reasons: string[];
  createdAt: Date;
}

export interface OpportunityAnalytics {
  totalOpportunities: number;
  byStatus: Record<OpportunityStatus, number>;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
  averageMatchScore: number;
  topMatchedCriteria: {
    criteriaId: string;
    name: string;
    matchCount: number;
    averageScore: number;
  }[];
  recentActivity: {
    date: Date;
    action: "created" | "updated" | "status_changed";
    count: number;
  }[];
}

export interface OpportunityExport {
  format: "csv" | "xlsx" | "pdf" | "json";
  filters?: OpportunityFilter;
  fields?: (keyof Opportunity)[];
  includeMetadata?: boolean;
}

export interface OpportunityImport {
  source: "csv" | "xlsx" | "json" | "api";
  data: Partial<Opportunity>[];
  options?: {
    skipDuplicates?: boolean;
    updateExisting?: boolean;
    validateData?: boolean;
  };
}

export interface OpportunityNotification {
  id: string;
  userId: string;
  opportunityId: string;
  type: "new_match" | "deadline_reminder" | "status_update" | "value_change";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  scheduledFor?: Date;
  metadata?: {
    previousValue?: any;
    newValue?: any;
    changes?: string[];
  };
}

export interface OpportunityWebhook {
  id: string;
  userId: string;
  url: string;
  events: (
    | "opportunity.created"
    | "opportunity.updated"
    | "opportunity.matched"
    | "opportunity.deadline"
  )[];
  isActive: boolean;
  secret?: string;
  createdAt: Date;
  lastTriggered?: Date;
  failureCount: number;
  maxFailures: number;
}

export interface OpportunityTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: {
    name: string;
    type: "text" | "number" | "date" | "select" | "multiselect" | "textarea";
    required: boolean;
    options?: string[];
    defaultValue?: any;
  }[];
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Supabase: opportunities table
export interface SupabaseOpportunity {
  id: string;
  whop_id: string;
  title: string;
  description?: string;
  payout?: number;
  category?: string;
  content_type?: string;
  brand?: string;
  requirements?: any; // JSONB
  difficulty_level?: number;
  estimated_hours?: number;
  deadline?: string;
  discovered_at: string;
  expires_at?: string;
  is_active: boolean;
  raw_data?: any; // JSONB
}

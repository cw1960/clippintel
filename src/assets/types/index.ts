// ClippIntell Bot Detection MVP - Core Types

export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export type BotRiskLevel = 'low' | 'medium' | 'high';

export interface SocialAccount {
  handle: string;
  platform: Platform;
  url?: string;
}

export interface BotSignals {
  followerQuality: 'normal' | 'suspicious' | 'fake';
  engagementPattern: 'organic' | 'automated' | 'suspicious';
  contentConsistency: 'good' | 'poor' | 'inconsistent';
  accountAge: 'established' | 'recent' | 'very_new';
  profileCompleteness: 'complete' | 'incomplete' | 'minimal';
  locationConsistency?: 'consistent' | 'inconsistent';
  verificationStatus?: 'verified' | 'unverified';
  networkAnalysis?: 'normal' | 'suspicious' | 'bot_cluster';
}

export interface AccountMetrics {
  followers: number;
  following: number;
  posts: number;
  avgLikes: number;
  avgComments: number;
  avgViews?: number;
  engagementRate: number;
  followerToFollowingRatio: number;
}

export interface BotAnalysisResult {
  id: string;
  account: SocialAccount;
  botScore: number; // 0-100
  riskLevel: BotRiskLevel;
  signals: BotSignals;
  metrics: AccountMetrics;
  redFlags: string[];
  recommendations: string[];
  confidence: number; // 0-100
  analysisDate: string;
  processingTime: number; // seconds
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  totalAnalyses: number;
  highRiskAccounts: number;
  averageBotScore: number;
}

export interface User {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'campaign_protection' | 'enterprise' | 'api_access';
  monthlyAnalysisLimit: number;
  analysisCount: number;
  createdAt: string;
}

export interface AnalysisRequest {
  accounts: SocialAccount[];
  campaignId?: string;
  priority: 'low' | 'normal' | 'high';
}

export interface BulkAnalysisProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  estimatedTimeRemaining: number; // seconds
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
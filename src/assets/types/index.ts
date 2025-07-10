export type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter';

export interface SocialAccount {
  handle: string;
  platform: Platform;
}

export interface AccountMetrics {
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  averageLikes: number;
  averageComments: number;
  accountAge: number; // days since account creation
  profileCompleteness: number; // 0-100%
  postFrequency: number; // posts per day
  lastActivity: number; // days since last post
}

export interface BotSignals {
  followersGrowthPattern: 'organic' | 'suspicious' | 'artificial';
  engagementPattern: 'normal' | 'automated' | 'suspicious';
  profileQuality: 'complete' | 'incomplete' | 'fake';
  contentQuality: 'good' | 'poor' | 'spam';
  accountAge: 'established' | 'recent' | 'brand_new';
  followingPattern: 'normal' | 'suspicious' | 'bot_like';
  activityPattern: 'consistent' | 'irregular' | 'bot_like';
  networkConnections: 'legitimate' | 'suspicious' | 'bot_network';
}

export interface BotAnalysisResult {
  account: SocialAccount;
  botScore: number; // 0-100, higher = more likely bot
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  metrics: AccountMetrics;
  signals: BotSignals;
  redFlags: string[];
  recommendations: string[];
  processingTime: number; // seconds
  timestamp: Date;
  geminiApiUsed: boolean;
  keyIndex: number; // which API key was used
}

export interface GeminiApiKey {
  key: string;
  index: number;
  lastUsed: Date;
  requestCount: number;
  isActive: boolean;
}

export interface ApiKeyManager {
  getNextAvailableKey(): GeminiApiKey | null;
  markKeyUsed(keyIndex: number): void;
  getKeyStats(): {
    totalKeys: number;
    activeKeys: number;
    totalRequests: number;
  };
}

export interface SocialMediaProfile {
  handle: string;
  displayName: string;
  bio: string;
  profileImageUrl: string;
  isVerified: boolean;
  followers: number;
  following: number;
  posts: number;
  accountCreated: Date;
  lastPost: Date;
  recentPosts: {
    id: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: Date;
  }[];
}

export interface BotDetectionConfig {
  useGeminiAI: boolean;
  fallbackToRules: boolean;
  maxRetries: number;
  timeoutMs: number;
  enableParallelAnalysis: boolean;
  minConfidenceThreshold: number;
}
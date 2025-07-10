export interface BotDetectionResult {
  username: string;
  platform: string;
  botProbability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  analysis: {
    profileAnalysis: { score: number };
    engagementAnalysis: { score: number };
    contentAnalysis: { score: number };
    networkAnalysis: { score: number };
  };
  recommendation: string;
  analysisDate: string;
}

const SUPABASE_URL = 'https://joxzubnkgelzxoyzotbt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveHp1Ym5rZ2VsenhveXpvdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4Mzg1ODQsImV4cCI6MjA2NzQxNDU4NH0.3oTCzc1g_G7-QCrEkYDgj2US4z2olyd6A7X-jlpcUoI';

class SocialMediaApiService {
  async analyzeYouTubeAccount(channelId: string, apiKey: string): Promise<BotDetectionResult> {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/youtube-bot-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ channelId, apiKey })
      });

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        ...result,
        platform: 'youtube',
        analysisDate: new Date().toISOString()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to analyze YouTube account: ${errorMessage}`);
    }
  }

  async analyzeInstagramAccount(username: string, accessToken: string): Promise<BotDetectionResult> {
    throw new Error('Instagram API integration pending approval');
  }

  async analyzeTikTokAccount(accessToken: string): Promise<BotDetectionResult> {
    throw new Error('TikTok API integration pending approval');
  }

  async analyzeTwitterAccount(username: string): Promise<BotDetectionResult> {
    throw new Error('Twitter API integration not yet implemented');
  }
}

export const socialMediaApi = new SocialMediaApiService();

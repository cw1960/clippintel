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
  
  // API Keys
  const YOUTUBE_API_KEY = 'AIzaSyB7h2m40gH1VxEWxcIJbnfO41-fvT73fGg';
  
  class SocialMediaApiService {
    
    /**
     * Analyze YouTube account for bot detection
     */
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
  
    /**
     * Analyze Twitter account for bot detection
     */
    async analyzeTwitterAccount(username: string): Promise<BotDetectionResult> {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/twitter-bot-detection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ username })
        });
  
        if (!response.ok) {
          throw new Error(`Twitter API error: ${response.status}`);
        }
  
        const result = await response.json();
        return {
          ...result,
          platform: 'twitter',
          analysisDate: new Date().toISOString()
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to analyze Twitter account: ${errorMessage}`);
      }
    }
  
    /**
     * Analyze TikTok account for bot detection
     */
    async analyzeTikTokAccount(accessToken: string): Promise<BotDetectionResult> {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/tiktok-bot-detection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ accessToken })
        });
  
        if (!response.ok) {
          throw new Error(`TikTok API error: ${response.status}`);
        }
  
        const result = await response.json();
        return {
          ...result,
          platform: 'tiktok',
          analysisDate: new Date().toISOString()
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to analyze TikTok account: ${errorMessage}`);
      }
    }
  
    /**
     * Analyze Instagram account for bot detection
     */
    async analyzeInstagramAccount(username: string, accessToken: string): Promise<BotDetectionResult> {
      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/instagram-bot-detection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ username, accessToken })
        });
  
        if (!response.ok) {
          throw new Error(`Instagram API error: ${response.status}`);
        }
  
        const result = await response.json();
        return {
          ...result,
          platform: 'instagram',
          analysisDate: new Date().toISOString()
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to analyze Instagram account: ${errorMessage}`);
      }
    }
  
    /**
     * Batch analyze multiple accounts across platforms
     */
    async batchAnalyze(accounts: Array<{
      platform: string, 
      username: string, 
      channelId?: string,
      accessToken?: string
    }>): Promise<BotDetectionResult[]> {
      const results: BotDetectionResult[] = [];
      
      for (const account of accounts) {
        try {
          let result: BotDetectionResult;
          
          switch (account.platform) {
            case 'youtube':
              const channelId = account.channelId || account.username;
              result = await this.analyzeYouTubeAccount(channelId, YOUTUBE_API_KEY);
              break;
            case 'twitter':
              result = await this.analyzeTwitterAccount(account.username);
              break;
            case 'tiktok':
              if (!account.accessToken) {
                throw new Error('Access token required for TikTok');
              }
              result = await this.analyzeTikTokAccount(account.accessToken);
              break;
            case 'instagram':
              if (!account.accessToken) {
                throw new Error('Access token required for Instagram');
              }
              result = await this.analyzeInstagramAccount(account.username, account.accessToken);
              break;
            default:
              throw new Error(`Unsupported platform: ${account.platform}`);
          }
          
          results.push(result);
        } catch (error: unknown) {
          console.error(`Error analyzing ${account.platform} account ${account.username}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          // Add error result instead of failing entire batch
          results.push({
            username: account.username,
            platform: account.platform,
            botProbability: 0,
            riskLevel: 'LOW',
            flags: [`Analysis failed: ${errorMessage}`],
            analysis: {
              profileAnalysis: { score: 0 },
              engagementAnalysis: { score: 0 },
              contentAnalysis: { score: 0 },
              networkAnalysis: { score: 0 }
            },
            recommendation: 'Manual review required - automated analysis failed',
            analysisDate: new Date().toISOString()
          });
        }
      }
      
      return results;
    }
  
    /**
     * Get platform-specific example usernames for testing
     */
    getExampleAccounts() {
      return {
        youtube: {
          channelId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
          name: 'MrBeast'
        },
        twitter: {
          username: 'elonmusk',
          name: 'Elon Musk'
        },
        instagram: {
          username: 'instagram',
          name: 'Instagram Official'
        },
        tiktok: {
          username: 'tiktok',
          name: 'TikTok Official'
        }
      };
    }
  }
  
  export const socialMediaApi = new SocialMediaApiService();
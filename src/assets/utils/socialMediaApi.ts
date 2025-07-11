// socialMediaApi.ts - Fixed Supabase Integration
// This will properly call your deployed Edge Functions

import { createClient } from '@supabase/supabase-js';

// Direct supabase initialization using your env vars
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface BotDetectionResult {
  platform: string;
  username: string;
  accountType?: string;
  channelId?: string;
  channelName?: string;
  displayName?: string;
  analysis: {
    botProbability: number;
    riskLevel: string;
    flags: string[];
    recommendation: string;
    metrics: any;
  };
}

// YouTube Analysis - LIVE EDGE FUNCTION
export async function analyzeYouTubeChannel(channelInput: string): Promise<BotDetectionResult> {
  try {
    console.log('🎥 Calling YouTube Edge Function for:', channelInput);
    
    const { data, error } = await supabase.functions.invoke('youtube-bot-detection', {
      body: { channelId: channelInput }
    });

    if (error) {
      console.error('❌ YouTube Edge Function error:', error);
      throw error;
    }

    console.log('✅ YouTube Edge Function SUCCESS - Live data:', data);
    return data;

  } catch (error) {
    console.error('🚫 YouTube Edge Function FAILED, using demo data:', error);
    
    // Demo fallback
    return {
      platform: 'youtube',
      username: channelInput,
      channelId: channelInput,
      channelName: `Demo: ${channelInput}`,
      analysis: {
        botProbability: 15,
        riskLevel: 'Low',
        flags: ['DEMO DATA - Edge Function failed'],
        recommendation: 'This is demo data due to API error.',
        metrics: {
          subscribers: 1000000,
          videos: 100,
          views: 50000000,
          channelAge: 365,
          uploadsLast30Days: 4,
          avgViewsPerVideo: 500000,
          subscriberGrowthRate: 5.2
        }
      }
    };
  }
}

// Twitter Analysis - LIVE EDGE FUNCTION
export async function analyzeTwitterAccount(username: string): Promise<BotDetectionResult> {
  try {
    const cleanUsername = username.replace('@', '');
    console.log('🐦 Calling Twitter Edge Function for:', cleanUsername);
    
    const { data, error } = await supabase.functions.invoke('twitter-bot-detection', {
      body: { username: cleanUsername }
    });

    if (error) {
      console.error('❌ Twitter Edge Function error:', error);
      throw error;
    }

    console.log('✅ Twitter Edge Function SUCCESS - Live data:', data);
    return data;

  } catch (error) {
    console.error('🚫 Twitter Edge Function FAILED, using demo data:', error);
    
    const cleanUsername = username.replace('@', '');
    return {
      platform: 'twitter',
      username: cleanUsername,
      displayName: cleanUsername,
      analysis: {
        botProbability: 12,
        riskLevel: 'Low',
        flags: ['DEMO DATA - Edge Function failed'],
        recommendation: 'This is demo data due to API error.',
        metrics: {
          followers: 50000,
          following: 1000,
          tweets: 5000,
          accountAge: 1000,
          followerRatio: 50,
          tweetsPerDay: 5,
          verificationStatus: false
        }
      }
    };
  }
}

// Instagram Analysis - LIVE EDGE FUNCTION
export async function analyzeInstagramAccount(username: string): Promise<BotDetectionResult> {
  try {
    const cleanUsername = username.replace('@', '');
    console.log('📸 Calling Instagram Edge Function for:', cleanUsername);
    
    const { data, error } = await supabase.functions.invoke('instagram-bot-detection', {
      body: { username: cleanUsername }
    });

    if (error) {
      console.error('❌ Instagram Edge Function error:', error);
      throw error;
    }

    console.log('✅ Instagram Edge Function SUCCESS - Live data:', data);
    return data;

  } catch (error) {
    console.error('🚫 Instagram Edge Function FAILED, using demo data:', error);
    
    // Demo fallback with known accounts
    const cleanUsername = username.replace('@', '');
    const demoAccounts: Record<string, any> = {
      'cristiano': {
        platform: 'instagram',
        username: 'cristiano',
        accountType: 'CREATOR',
        analysis: {
          botProbability: 5,
          riskLevel: 'Very Low',
          flags: ['DEMO DATA - Edge Function failed'],
          recommendation: 'Demo: Account appears authentic.',
          metrics: {
            followers: 635000000,
            following: 540,
            posts: 3489,
            accountType: 'CREATOR',
            followerRatio: 1175925.93
          }
        }
      },
      'fake_account_123': {
        platform: 'instagram',
        username: 'fake_account_123',
        accountType: 'PERSONAL',
        analysis: {
          botProbability: 85,
          riskLevel: 'High',
          flags: [
            'DEMO DATA - Edge Function failed',
            'Username ends with many numbers',
            'Low engagement rate'
          ],
          recommendation: 'Demo: Strong evidence of bot activity.',
          metrics: {
            followers: 1200,
            following: 5600,
            posts: 3,
            accountType: 'PERSONAL',
            followerRatio: 0.21
          }
        }
      }
    };

    return demoAccounts[cleanUsername.toLowerCase()] || {
      platform: 'instagram',
      username: cleanUsername,
      accountType: 'UNKNOWN',
      analysis: {
        botProbability: 45,
        riskLevel: 'Medium',
        flags: ['DEMO DATA - Edge Function failed'],
        recommendation: 'Demo: Requires manual review.',
        metrics: {
          followers: 0,
          following: 0,
          posts: 0,
          accountType: 'UNKNOWN',
          followerRatio: 0
        }
      }
    };
  }
}

// TikTok Analysis - LIVE EDGE FUNCTION
export async function analyzeTikTokAccount(username: string): Promise<BotDetectionResult> {
  try {
    const cleanUsername = username.replace('@', '');
    console.log('🎵 Calling TikTok Edge Function for:', cleanUsername);
    
    const { data, error } = await supabase.functions.invoke('tiktok-bot-detection', {
      body: { username: cleanUsername }
    });

    if (error) {
      console.error('❌ TikTok Edge Function error:', error);
      throw error;
    }

    console.log('✅ TikTok Edge Function SUCCESS - Live data:', data);
    return data;

  } catch (error) {
    console.error('🚫 TikTok Edge Function FAILED, using demo data:', error);
    
    const cleanUsername = username.replace('@', '');
    const demoAccounts: Record<string, any> = {
      'charlidamelio': {
        platform: 'tiktok',
        username: 'charlidamelio',
        displayName: 'Charli D\'Amelio',
        analysis: {
          botProbability: 3,
          riskLevel: 'Very Low',
          flags: ['DEMO DATA - Edge Function failed'],
          recommendation: 'Demo: Verified creator with excellent engagement.',
          metrics: {
            followers: 151000000,
            following: 1542,
            videos: 2341,
            likes: 11200000000,
            followerRatio: 97923.45,
            engagementRate: 8.5
          }
        }
      }
    };

    return demoAccounts[cleanUsername.toLowerCase()] || {
      platform: 'tiktok',
      username: cleanUsername,
      displayName: cleanUsername,
      analysis: {
        botProbability: 50,
        riskLevel: 'Medium',
        flags: ['DEMO DATA - Edge Function failed'],
        recommendation: 'Demo: Manual review required.',
        metrics: {
          followers: 0,
          following: 0,
          videos: 0,
          likes: 0,
          followerRatio: 0,
          engagementRate: 0
        }
      }
    };
  }
}

// Utility Functions
export function validatePlatformInput(platform: string, input: string): { isValid: boolean; error?: string } {
  if (!input.trim()) {
    return { isValid: false, error: 'Account input is required' };
  }
  return { isValid: true };
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel?.toLowerCase()) {
    case 'very low':
      return 'text-green-600 bg-green-50';
    case 'low':
      return 'text-green-600 bg-green-50';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50';
    case 'high':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}
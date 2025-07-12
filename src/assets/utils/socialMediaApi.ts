import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://joxzubnkgelzxoyzotbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveHp1Ym5rZ2VsenhveXpvdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3NjcyNzgsImV4cCI6MjAzNjM0MzI3OH0.4aBJwQs4FqJqHlQ3Z_Ku-VGjxlnXgNs91mE7zORqY_Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface BotDetectionResult {
  platform: string;
  username?: string;
  channelId?: string;
  channelName?: string;
  displayName?: string;
  analysis: {
    botProbability: number;
    riskLevel: string;
    flags: string[];
    recommendation: string;
    metrics: Record<string, any>;
  };
}

export function validatePlatformInput(platform: string, input: string) {
  const trimmed = input.trim();
  if (!trimmed) return { isValid: false, error: 'Input cannot be empty' };
  return { isValid: true };
}

export function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'low': return 'bg-green-100 text-green-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'high': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

export async function analyzeYouTubeChannel(channelInput: string): Promise<BotDetectionResult> {
  const { data, error } = await supabase.functions.invoke('youtube-bot-detection', {
    body: { channelInput }
  });
  if (error) throw new Error('YouTube analysis failed');
  return data;
}

export async function analyzeTikTokAccount(username: string): Promise<BotDetectionResult> {
  const { data, error } = await supabase.functions.invoke('tiktok-bot-detection', {
    body: { username }
  });
  if (error) throw new Error('TikTok analysis failed');
  return data;
}

export async function analyzeTwitterAccount(username: string): Promise<BotDetectionResult> {
  throw new Error('Twitter integration not yet implemented');
}

export async function analyzeInstagramAccount(username: string): Promise<BotDetectionResult> {
  throw new Error('Instagram integration not yet implemented');
}

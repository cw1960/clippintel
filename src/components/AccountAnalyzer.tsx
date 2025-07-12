// AccountAnalyzer.tsx - FIXED with proper null safety
import React, { useState, useEffect } from 'react';
import { 
  analyzeYouTubeChannel,
  analyzeTwitterAccount,
  analyzeInstagramAccount,
  analyzeTikTokAccount,
  validatePlatformInput,
  getRiskColor,
  formatNumber,
  type BotDetectionResult 
} from '../assets/utils/socialMediaApi';

type Platform = 'youtube' | 'twitter' | 'instagram' | 'tiktok';

interface DemoAccount {
  label: string;
  value: string;
  description?: string;
}

// Updated interface for new advanced bot detection response
interface AdvancedBotDetectionResult {
  platform: string;
  username: string;
  displayName: string;
  analysis_timestamp: string;
  data_source: string;
  executive_summary: {
    bot_probability: number;
    risk_level: string;
    confidence_level: number;
    recommendation: string;
    key_findings: string[];
  };
  detailed_analysis: {
    geographic_analysis: any;
    temporal_analysis: any;
    content_analysis: any;
    network_analysis: any;
    technical_analysis: any;
    engagement_analysis: any;
  };
  account_metrics: {
    followers: number;
    following: number;
    videos: number;
    likes: number;
    verified: boolean;
    account_age_days: number;
    follower_ratio: number;
  };
  video_analysis: {
    individual_videos: any[];
    video_summary: any;
  };
  risk_factors: {
    contributing_factors: any[];
    all_flags: string[];
    severity_breakdown: Record<string, number>;
  };
  raw_data_reference?: {
    data_points_analyzed: number;
    analysis_modules_used: string[];
    scraped_at: string;
  };
}

// Persistent state interface
interface PersistentState {
  analysisResult: BotDetectionResult | AdvancedBotDetectionResult | null;
  selectedPlatform: Platform;
  accountInput: string;
  timestamp: number;
}

export default function AccountAnalyzer() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [accountInput, setAccountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BotDetectionResult | AdvancedBotDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Storage keys
  const STORAGE_KEY = 'clippintell_analysis_state';

  // Check if result is from advanced system
  const isAdvancedResult = (result: any): result is AdvancedBotDetectionResult => {
    return result && result.executive_summary && typeof result.executive_summary.bot_probability === 'number';
  };

  // Save state to sessionStorage
  const saveState = (newResult?: BotDetectionResult | AdvancedBotDetectionResult | null, newPlatform?: Platform, newInput?: string) => {
    try {
      const stateToSave: PersistentState = {
        analysisResult: newResult !== undefined ? newResult : analysisResult,
        selectedPlatform: newPlatform !== undefined ? newPlatform : selectedPlatform,
        accountInput: newInput !== undefined ? newInput : accountInput,
        timestamp: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save state to sessionStorage:', error);
    }
  };

  // Load state from sessionStorage
  const loadState = () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState: PersistentState = JSON.parse(saved);
        
        // Only restore if saved within last 2 hours (prevent stale data)
        const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
        if (parsedState.timestamp > twoHoursAgo) {
          // Validate the saved result before restoring
          if (parsedState.analysisResult) {
            const result = parsedState.analysisResult;
            if (isAdvancedResult(result) || (result as any).analysis?.botProbability !== undefined) {
              setAnalysisResult(parsedState.analysisResult);
              setSelectedPlatform(parsedState.selectedPlatform);
              setAccountInput(parsedState.accountInput);
              console.log('✅ Restored analysis state from session');
            } else {
              console.log('🗑️ Cleared invalid analysis state');
              sessionStorage.removeItem(STORAGE_KEY);
            }
          } else {
            setSelectedPlatform(parsedState.selectedPlatform);
            setAccountInput(parsedState.accountInput);
          }
        } else {
          // Clear old data
          sessionStorage.removeItem(STORAGE_KEY);
          console.log('🗑️ Cleared old analysis state');
        }
      }
    } catch (error) {
      console.warn('Failed to load state from sessionStorage:', error);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  // Load state on component mount
  useEffect(() => {
    loadState();
  }, []);

  // Save state when analysis result changes
  useEffect(() => {
    if (analysisResult) {
      saveState(analysisResult);
    }
  }, [analysisResult]);

  // Platform Configuration
  const platforms = {
    youtube: {
      name: 'YouTube',
      icon: '🎥',
      color: 'red',
      placeholder: 'Enter YouTube channel ID or @username',
      enabled: true
    },
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: 'blue',
      placeholder: 'Enter Twitter username (without @)',
      enabled: true
    },
    instagram: {
      name: 'Instagram',
      icon: '📸',
      color: 'pink',
      placeholder: 'Enter Instagram username (without @)',
      enabled: true
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      color: 'black',
      placeholder: 'Enter TikTok username (without @)',
      enabled: true
    }
  } as const;

  // Demo accounts for each platform
  const getDemoAccounts = (): DemoAccount[] => {
    switch (selectedPlatform) {
      case 'youtube':
        return [
          { 
            label: 'MrBeast', 
            value: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
            description: 'Popular creator - should show low bot probability'
          },
          { 
            label: 'PewDiePie', 
            value: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
            description: 'Established creator - authentic account'
          }
        ];
      case 'twitter':
        return [
          { 
            label: 'Elon Musk', 
            value: 'elonmusk',
            description: 'High-profile account - low bot risk'
          },
          { 
            label: 'Barack Obama', 
            value: 'BarackObama',
            description: 'Verified political figure'
          }
        ];
      case 'instagram':
        return [
          { 
            label: 'Cristiano Ronaldo', 
            value: 'cristiano',
            description: 'Most followed account - very low risk'
          },
          { 
            label: 'Selena Gomez', 
            value: 'selenagomez',
            description: 'Celebrity account - authentic'
          },
          { 
            label: 'Fashion Influencer', 
            value: 'fashion_influencer_2024',
            description: 'New creator account - low risk'
          },
          { 
            label: 'Fake Account (Demo)', 
            value: 'fake_account_123',
            description: 'Example bot account - high risk'
          }
        ];
      case 'tiktok':
        return [
          { 
            label: 'Charli D\'Amelio', 
            value: 'charlidamelio',
            description: 'Top creator - very low risk'
          },
          { 
            label: 'Real Account Test', 
            value: 'acseltrapp',
            description: 'Real account - test real data scraping'
          },
          { 
            label: 'Suspicious Account (Demo)', 
            value: 'user12345',
            description: 'Example suspicious account - medium risk'
          }
        ];
      default:
        return [];
    }
  };

  // Platform Button Component
  const PlatformButton = ({ platform }: { platform: Platform }) => {
    const config = platforms[platform];
    const isActive = selectedPlatform === platform;
    
    const handlePlatformSwitch = () => {
      setSelectedPlatform(platform);
      // Clear current analysis when switching platforms
      setAnalysisResult(null);
      setAccountInput('');
      setError(null);
      saveState(null, platform, '');
    };
    
    return (
      <button
        onClick={handlePlatformSwitch}
        disabled={!config.enabled}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : config.enabled
            ? 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
        }`}
      >
        <span className="text-xl">{config.icon}</span>
        <span>{config.name}</span>
        {!config.enabled && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Pending
          </span>
        )}
      </button>
    );
  };

  // Demo Account Button Component
  const DemoAccountButton = ({ account }: { account: DemoAccount }) => (
    <button
      onClick={() => {
        setAccountInput(account.value);
        saveState(undefined, undefined, account.value);
      }}
      className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="font-medium text-gray-900">{account.label}</div>
      {account.description && (
        <div className="text-sm text-gray-600 mt-1">{account.description}</div>
      )}
      <div className="text-xs text-blue-600 mt-1 font-mono">{account.value}</div>
    </button>
  );

  // Analysis Handler
  const handleAnalyzeAccount = async () => {
    if (!accountInput.trim()) {
      setError('Please enter an account identifier');
      return;
    }

    // Validate input
    const validation = validatePlatformInput(selectedPlatform, accountInput);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid input');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let result: BotDetectionResult | AdvancedBotDetectionResult;
      
      switch (selectedPlatform) {
        case 'youtube':
          result = await analyzeYouTubeChannel(accountInput);
          break;
        case 'twitter':
          result = await analyzeTwitterAccount(accountInput);
          break;
        case 'instagram':
          result = await analyzeInstagramAccount(accountInput);
          break;
        case 'tiktok':
          result = await analyzeTikTokAccount(accountInput);
          break;
        default:
          throw new Error(`Platform ${selectedPlatform} not supported`);
      }
      
      setAnalysisResult(result);
      saveState(result); // Save immediately after successful analysis
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  // Risk Level Badge Component
  const RiskBadge = ({ riskLevel }: { riskLevel: string }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskLevel)}`}>
      {riskLevel}
    </span>
  );

  // Get bot probability from either old or new format - WITH NULL SAFETY
  const getBotProbability = (result: BotDetectionResult | AdvancedBotDetectionResult): number => {
    if (!result) return 0;
    
    if (isAdvancedResult(result)) {
      return result.executive_summary?.bot_probability || 0;
    }
    
    const oldResult = result as BotDetectionResult;
    return oldResult.analysis?.botProbability || 0;
  };

  // Get risk level from either old or new format - WITH NULL SAFETY
  const getRiskLevel = (result: BotDetectionResult | AdvancedBotDetectionResult): string => {
    if (!result) return 'Unknown';
    
    if (isAdvancedResult(result)) {
      return result.executive_summary?.risk_level || 'Unknown';
    }
    
    const oldResult = result as BotDetectionResult;
    return oldResult.analysis?.riskLevel || 'Unknown';
  };

  // Get flags from either old or new format - WITH NULL SAFETY
  const getFlags = (result: BotDetectionResult | AdvancedBotDetectionResult): string[] => {
    if (!result) return [];
    
    if (isAdvancedResult(result)) {
      return result.risk_factors?.all_flags || [];
    }
    
    const oldResult = result as BotDetectionResult;
    return oldResult.analysis?.flags || [];
  };

  // Get recommendation from either old or new format - WITH NULL SAFETY
  const getRecommendation = (result: BotDetectionResult | AdvancedBotDetectionResult): string => {
    if (!result) return 'No recommendation available';
    
    if (isAdvancedResult(result)) {
      return result.executive_summary?.recommendation || 'No recommendation available';
    }
    
    const oldResult = result as BotDetectionResult;
    return oldResult.analysis?.recommendation || 'No recommendation available';
  };

  // Metrics Display Component - Updated for both formats WITH NULL SAFETY
  const MetricsGrid = ({ result }: { result: BotDetectionResult | AdvancedBotDetectionResult }) => {
    if (!result) return null;
    
    const getMetricsForPlatform = () => {
      if (isAdvancedResult(result)) {
        // New advanced format
        const metrics = result.account_metrics;
        if (!metrics) return [];
        
        switch (result.platform) {
          case 'tiktok':
            return [
              { label: 'Followers', value: formatNumber(metrics.followers || 0) },
              { label: 'Following', value: formatNumber(metrics.following || 0) },
              { label: 'Videos', value: formatNumber(metrics.videos || 0) },
              { label: 'Total Likes', value: formatNumber(metrics.likes || 0) },
              { label: 'Verified', value: metrics.verified ? 'Yes' : 'No' },
              { label: 'Account Age', value: `${metrics.account_age_days || 0} days` },
              { label: 'Follower Ratio', value: (metrics.follower_ratio || 0).toFixed(2) },
              { label: 'Confidence', value: `${((result.executive_summary?.confidence_level || 0) * 100).toFixed(1)}%` }
            ];
          default:
            return [
              { label: 'Followers', value: formatNumber(metrics.followers || 0) },
              { label: 'Following', value: formatNumber(metrics.following || 0) },
              { label: 'Content Items', value: formatNumber(metrics.videos || 0) },
              { label: 'Total Engagements', value: formatNumber(metrics.likes || 0) },
              { label: 'Verified', value: metrics.verified ? 'Yes' : 'No' },
              { label: 'Account Age', value: `${metrics.account_age_days || 0} days` }
            ];
        }
      } else {
        // Old format - keep existing logic WITH NULL SAFETY
        const oldResult = result as BotDetectionResult;
        const metrics = oldResult.analysis?.metrics;
        if (!metrics) return [];
        
        switch (oldResult.platform) {
          case 'youtube':
            return [
              { label: 'Subscribers', value: formatNumber(metrics.subscribers || 0) },
              { label: 'Videos', value: formatNumber(metrics.videos || 0) },
              { label: 'Total Views', value: formatNumber(metrics.views || 0) },
              { label: 'Channel Age', value: `${metrics.channelAge || 0} days` },
              { label: 'Recent Uploads', value: `${metrics.uploadsLast30Days || 0}/30 days` },
              { label: 'Avg Views/Video', value: formatNumber(metrics.avgViewsPerVideo || 0) }
            ];
          case 'twitter':
            return [
              { label: 'Followers', value: formatNumber(metrics.followers || 0) },
              { label: 'Following', value: formatNumber(metrics.following || 0) },
              { label: 'Tweets', value: formatNumber(metrics.tweets || 0) },
              { label: 'Account Age', value: `${metrics.accountAge || 0} days` },
              { label: 'Follower Ratio', value: (metrics.followerRatio || 0).toFixed(2) },
              { label: 'Tweets/Day', value: (metrics.tweetsPerDay || 0).toFixed(1) }
            ];
          case 'instagram':
            return [
              { label: 'Followers', value: formatNumber(metrics.followers || 0) },
              { label: 'Following', value: formatNumber(metrics.following || 0) },
              { label: 'Posts', value: formatNumber(metrics.posts || 0) },
              { label: 'Account Type', value: metrics.accountType || 'Unknown' },
              { label: 'Follower Ratio', value: (metrics.followerRatio || 0).toFixed(2) }
            ];
          case 'tiktok':
            return [
              { label: 'Followers', value: formatNumber(metrics.followers || 0) },
              { label: 'Following', value: formatNumber(metrics.following || 0) },
              { label: 'Videos', value: formatNumber(metrics.videos || 0) },
              { label: 'Total Likes', value: formatNumber(metrics.likes || 0) },
              { label: 'Engagement Rate', value: `${metrics.engagementRate || 0}%` }
            ];
          default:
            return [];
        }
      }
    };

    const metrics = getMetricsForPlatform();

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
          </div>
        ))}
      </div>
    );
  };

  // Get display name for results header - WITH NULL SAFETY
  const getDisplayName = (result: BotDetectionResult | AdvancedBotDetectionResult) => {
    if (!result) return 'Unknown';
    
    if (isAdvancedResult(result)) {
      return result.displayName || result.username || 'Unknown';
    }
    
    const oldResult = result as BotDetectionResult;
    switch (oldResult.platform) {
      case 'youtube':
        return oldResult.channelName || oldResult.channelId || 'Unknown';
      case 'twitter':
        return `@${oldResult.username || 'unknown'}`;
      case 'instagram':
        return `@${oldResult.username || 'unknown'}`;
      case 'tiktok':
        return `@${oldResult.username || 'unknown'}`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Advanced Bot Detection System
          </h2>
          <p className="text-gray-600">
            Comprehensive fraud detection with REAL data scraping - NO FAKE DATA
          </p>
        </div>

        {/* Platform Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Platform</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {(Object.keys(platforms) as Platform[]).map((platform) => (
              <PlatformButton key={platform} platform={platform} />
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={accountInput}
                onChange={(e) => {
                  setAccountInput(e.target.value);
                  saveState(undefined, undefined, e.target.value);
                }}
                placeholder={platforms[selectedPlatform].placeholder}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyzeAccount()}
              />
            </div>
            <button
              onClick={handleAnalyzeAccount}
              disabled={loading || !platforms[selectedPlatform].enabled}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze Account'}
            </button>
          </div>
        </div>

        {/* Demo Accounts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Try Demo Accounts for {platforms[selectedPlatform].name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getDemoAccounts().map((account, index) => (
              <DemoAccountButton key={index} account={account} />
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <div>
                <h4 className="text-red-800 font-semibold">Analysis Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Scraping REAL TikTok data and running bot analysis...</p>
            <p className="text-sm text-gray-500 mt-2">
              {selectedPlatform === 'tiktok' 
                ? 'REAL data scraping • Geographic patterns • Temporal behavior • Content authenticity • Network analysis • Technical metadata • Engagement quality'
                : 'Running comprehensive bot detection analysis...'
              }
            </p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {platforms[analysisResult.platform as Platform]?.icon || '📊'} {getDisplayName(analysisResult)}
                  </h3>
                  <p className="text-gray-600 capitalize">{analysisResult.platform} Account Analysis</p>
                  {isAdvancedResult(analysisResult) && (
                    <p className="text-sm text-blue-600 mt-1">
                      ✨ Advanced 6-Module Analysis • REAL Data Scraping • Video-Level Detection
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {getBotProbability(analysisResult).toFixed(1)}%
                  </div>
                  <RiskBadge riskLevel={getRiskLevel(analysisResult)} />
                </div>
              </div>
            </div>

            {/* Bot Probability Meter */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Bot Probability Score</h4>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      getBotProbability(analysisResult) >= 70
                        ? 'bg-red-500'
                        : getBotProbability(analysisResult) >= 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${getBotProbability(analysisResult)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Authentic (0%)</span>
                  <span>Suspicious (50%)</span>
                  <span>Bot (100%)</span>
                </div>
              </div>
            </div>

            {/* Account Metrics */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Metrics</h4>
              <MetricsGrid result={analysisResult} />
            </div>

            {/* Advanced Analysis Modules (only for TikTok advanced results) */}
            {isAdvancedResult(analysisResult) && (
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🎯 Advanced Analysis Modules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900">🌍 Geographic Analysis</h5>
                    <p className="text-sm text-blue-800 mt-1">Bot farm detection & location patterns</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-900">⏰ Temporal Analysis</h5>
                    <p className="text-sm text-green-800 mt-1">Growth patterns & posting behavior</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h5 className="font-semibold text-purple-900">🔍 Content Authenticity</h5>
                    <p className="text-sm text-purple-800 mt-1">Username & bio pattern analysis</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-semibold text-orange-900">🕸️ Network Behavior</h5>
                    <p className="text-sm text-orange-800 mt-1">Follower ratios & connections</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h5 className="font-semibold text-red-900">🔧 Technical Metadata</h5>
                    <p className="text-sm text-red-800 mt-1">Account creation & profile patterns</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h5 className="font-semibold text-yellow-900">💬 Engagement Quality</h5>
                    <p className="text-sm text-yellow-800 mt-1">Comment ratios & interaction analysis</p>
                  </div>
                </div>
                
                {/* Video Analysis Summary */}
                {analysisResult.video_analysis?.individual_videos?.length > 0 && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <h5 className="font-semibold text-indigo-900 mb-2">🎬 Video-Level Analysis</h5>
                    <div className="text-sm text-indigo-800">
                      <p>Analyzed <strong>{analysisResult.video_analysis.individual_videos.length} videos</strong> individually</p>
                      <p>Average video bot probability: <strong>{analysisResult.video_analysis.video_summary?.avg_video_bot_probability || 0}%</strong></p>
                      <p>High-risk videos detected: <strong>{analysisResult.video_analysis.video_summary?.high_risk_videos || 0}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Findings (for advanced results) */}
            {isAdvancedResult(analysisResult) && analysisResult.executive_summary?.key_findings?.length > 0 && (
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Key Findings</h4>
                <div className="space-y-2">
                  {analysisResult.executive_summary.key_findings.map((finding, index) => (
                    <div key={index} className="flex items-center text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                      <span className="text-blue-500 mr-2">📊</span>
                      {finding}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flags and Issues */}
            {getFlags(analysisResult).length > 0 && (
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detected Issues</h4>
                <div className="space-y-2">
                  {getFlags(analysisResult).map((flag, index) => (
                    <div key={index} className="flex items-center text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                      <span className="text-amber-500 mr-2">⚠️</span>
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendation</h4>
              <div className={`p-4 rounded-lg ${
                getRiskLevel(analysisResult) === 'High' || getRiskLevel(analysisResult) === 'Critical'
                  ? 'bg-red-50 text-red-800'
                  : getRiskLevel(analysisResult) === 'Medium'
                  ? 'bg-yellow-50 text-yellow-800'
                  : 'bg-green-50 text-green-800'
              }`}>
                <p className="font-medium">{getRecommendation(analysisResult)}</p>
              </div>
            </div>

            {/* Advanced Analysis Details (only for advanced results) */}
            {isAdvancedResult(analysisResult) && analysisResult.risk_factors && (
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Analysis Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Contributing Factors */}
                  {analysisResult.risk_factors.contributing_factors?.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Risk Factors</h5>
                      <div className="space-y-2">
                        {analysisResult.risk_factors.contributing_factors.map((factor, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium capitalize">{factor.module?.replace('_', ' ') || 'Unknown'}</span>
                              <span className="text-red-600 font-semibold">+{factor.contribution || 0} pts</span>
                            </div>
                            <div className="text-sm text-gray-600">Score: {factor.score || 0} • Weight: {((factor.weight || 0) * 100)}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Severity Breakdown */}
                  {analysisResult.risk_factors.severity_breakdown && (
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Severity Breakdown</h5>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.risk_factors.severity_breakdown).map(([level, count]) => (
                          <div key={level} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">{level} Risk</span>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                              level === 'Critical' ? 'bg-red-100 text-red-800' :
                              level === 'High' ? 'bg-orange-100 text-orange-800' :
                              level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {count} modules
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Metadata */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="font-medium">Analysis Time:</span> {new Date(analysisResult.analysis_timestamp).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Data Points:</span> {analysisResult.raw_data_reference?.data_points_analyzed || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span> {((analysisResult.executive_summary?.confidence_level || 0) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Platform Status */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Platform Status:</strong> YouTube ✅ | Twitter ✅ | Instagram ✅ | TikTok ✅ (REAL Data Scraping)
            </p>
            <p>
              {selectedPlatform === 'tiktok' 
                ? '🔥 Advanced 6-module bot detection with REAL TikTok data scraping - NO FAKE DATA' 
                : `Real-time bot detection powered by ${platforms[selectedPlatform].name} API integration`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
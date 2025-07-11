// AccountAnalyzer.tsx - With Persistent Results
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

// Persistent state interface
interface PersistentState {
  analysisResult: BotDetectionResult | null;
  selectedPlatform: Platform;
  accountInput: string;
  timestamp: number;
}

export default function AccountAnalyzer() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [accountInput, setAccountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BotDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Storage keys
  const STORAGE_KEY = 'clippintell_analysis_state';

  // Save state to sessionStorage
  const saveState = (newResult?: BotDetectionResult | null, newPlatform?: Platform, newInput?: string) => {
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
          setAnalysisResult(parsedState.analysisResult);
          setSelectedPlatform(parsedState.selectedPlatform);
          setAccountInput(parsedState.accountInput);
          console.log('✅ Restored analysis state from session');
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
            label: 'TikTok Bot (Demo)', 
            value: 'tiktok_bot_2024',
            description: 'Example bot account - high risk'
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
      let result: BotDetectionResult;
      
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

  // Metrics Display Component
  const MetricsGrid = ({ result }: { result: BotDetectionResult }) => {
    const getMetricsForPlatform = () => {
      switch (result.platform) {
        case 'youtube':
          return [
            { label: 'Subscribers', value: formatNumber(result.analysis.metrics.subscribers) },
            { label: 'Videos', value: formatNumber(result.analysis.metrics.videos) },
            { label: 'Total Views', value: formatNumber(result.analysis.metrics.views) },
            { label: 'Channel Age', value: `${result.analysis.metrics.channelAge} days` },
            { label: 'Recent Uploads', value: `${result.analysis.metrics.uploadsLast30Days}/30 days` },
            { label: 'Avg Views/Video', value: formatNumber(result.analysis.metrics.avgViewsPerVideo) }
          ];
        case 'twitter':
          return [
            { label: 'Followers', value: formatNumber(result.analysis.metrics.followers) },
            { label: 'Following', value: formatNumber(result.analysis.metrics.following) },
            { label: 'Tweets', value: formatNumber(result.analysis.metrics.tweets) },
            { label: 'Account Age', value: `${result.analysis.metrics.accountAge} days` },
            { label: 'Follower Ratio', value: result.analysis.metrics.followerRatio.toFixed(2) },
            { label: 'Tweets/Day', value: result.analysis.metrics.tweetsPerDay.toFixed(1) }
          ];
        case 'instagram':
          return [
            { label: 'Followers', value: formatNumber(result.analysis.metrics.followers) },
            { label: 'Following', value: formatNumber(result.analysis.metrics.following) },
            { label: 'Posts', value: formatNumber(result.analysis.metrics.posts) },
            { label: 'Account Type', value: result.analysis.metrics.accountType },
            { label: 'Follower Ratio', value: result.analysis.metrics.followerRatio.toFixed(2) }
          ];
        case 'tiktok':
          return [
            { label: 'Followers', value: formatNumber(result.analysis.metrics.followers) },
            { label: 'Following', value: formatNumber(result.analysis.metrics.following) },
            { label: 'Videos', value: formatNumber(result.analysis.metrics.videos) },
            { label: 'Total Likes', value: formatNumber(result.analysis.metrics.likes) },
            { label: 'Engagement Rate', value: `${result.analysis.metrics.engagementRate}%` }
          ];
        default:
          return [];
      }
    };

    const metrics = getMetricsForPlatform();

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
          </div>
        ))}
      </div>
    );
  };

  // Get display name for results header
  const getDisplayName = (result: BotDetectionResult) => {
    switch (result.platform) {
      case 'youtube':
        return result.channelName || result.channelId;
      case 'twitter':
        return `@${result.username}`;
      case 'instagram':
        return `@${result.username}`;
      case 'tiktok':
        return `@${result.username}`;
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
            Social Media Bot Detection
          </h2>
          <p className="text-gray-600">
            Analyze accounts across multiple platforms to detect potential bot activity
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
            <p className="mt-4 text-gray-600">Analyzing account for bot indicators...</p>
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
                    {platforms[analysisResult.platform as Platform].icon} {getDisplayName(analysisResult)}
                  </h3>
                  <p className="text-gray-600 capitalize">{analysisResult.platform} Account Analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {analysisResult.analysis.botProbability}%
                  </div>
                  <RiskBadge riskLevel={analysisResult.analysis.riskLevel} />
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
                      analysisResult.analysis.botProbability >= 70
                        ? 'bg-red-500'
                        : analysisResult.analysis.botProbability >= 40
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${analysisResult.analysis.botProbability}%` }}
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

            {/* Flags and Issues */}
            {analysisResult.analysis.flags.length > 0 && (
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Detected Issues</h4>
                <div className="space-y-2">
                  {analysisResult.analysis.flags.map((flag, index) => (
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
                analysisResult.analysis.riskLevel === 'High'
                  ? 'bg-red-50 text-red-800'
                  : analysisResult.analysis.riskLevel === 'Medium'
                  ? 'bg-yellow-50 text-yellow-800'
                  : 'bg-green-50 text-green-800'
              }`}>
                <p className="font-medium">{analysisResult.analysis.recommendation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Platform Status */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Platform Status:</strong> YouTube ✅ | Twitter ✅ | Instagram ✅ | TikTok ✅
            </p>
            <p>
              Real-time bot detection powered by {platforms[selectedPlatform].name} API integration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
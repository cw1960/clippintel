import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Instagram, Youtube, Twitter, Loader } from 'lucide-react';
import { socialMediaApi, type BotDetectionResult } from '../utils/socialMediaApi';

interface AnalysisState {
  isAnalyzing: boolean;
  result: BotDetectionResult | null;
  error: string | null;
}

export default function AccountAnalyzer() {
  const [username, setUsername] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'twitter' | 'instagram' | 'tiktok'>('youtube');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isAnalyzing: false,
    result: null,
    error: null
  });

  const YOUTUBE_API_KEY = 'AIzaSyB7h2m40gH1VxEWxcIJbnfO41-fvT73fGg';

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setAnalysis(prev => ({ ...prev, error: 'Please enter a username or channel ID' }));
      return;
    }

    setAnalysis({ isAnalyzing: true, result: null, error: null });

    try {
      let result: BotDetectionResult;

      switch (platform) {
        case 'youtube':
          result = await socialMediaApi.analyzeYouTubeAccount(username.trim(), YOUTUBE_API_KEY);
          break;
        case 'twitter':
          result = await socialMediaApi.analyzeTwitterAccount(username.trim());
          break;
        case 'instagram':
          result = await socialMediaApi.analyzeInstagramAccount(username.trim(), '');
          break;
        case 'tiktok':
          result = await socialMediaApi.analyzeTikTokAccount('');
          break;
        default:
          throw new Error('Unsupported platform');
      }

      setAnalysis({ isAnalyzing: false, result, error: null });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setAnalysis({ isAnalyzing: false, result: null, error: errorMessage });
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW': return <CheckCircle className="w-5 h-5" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'CRITICAL': return <XCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getExampleData = () => {
    switch (platform) {
      case 'youtube': return { value: 'UCX6OQ3DkcsbYNE6H8uQQuVA', label: 'Try MrBeast' };
      case 'twitter': return { value: 'elonmusk', label: 'Try Elon Musk' };
      case 'instagram': return { value: 'instagram', label: 'Try Instagram' };
      case 'tiktok': return { value: 'tiktok', label: 'Try TikTok' };
      default: return { value: '', label: 'Try Example' };
    }
  };

  const getInputLabel = () => {
    switch (platform) {
      case 'youtube': return 'YouTube Channel ID';
      case 'twitter': return 'Twitter Username';
      case 'instagram': return 'Instagram Username';
      case 'tiktok': return 'TikTok Username';
      default: return 'Username';
    }
  };

  const getPlaceholder = () => {
    switch (platform) {
      case 'youtube': return 'Enter YouTube Channel ID (e.g., UCX6OQ3DkcsbYNE6H8uQQuVA)';
      case 'twitter': return 'Enter Twitter username (e.g., elonmusk)';
      case 'instagram': return 'Enter Instagram username';
      case 'tiktok': return 'Enter TikTok username';
      default: return 'Enter username';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Social Media Bot Detection</h2>
          <p className="text-gray-600">
            Analyze social media accounts to detect fake accounts, bots, and suspicious activity patterns.
          </p>
        </div>

        <div className="p-6">
          {/* Platform Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Platform</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'youtube', label: 'YouTube', icon: <Youtube className="w-5 h-5" />, available: true, status: '✅ Live API' },
                { value: 'twitter', label: 'Twitter/X', icon: <Twitter className="w-5 h-5" />, available: true, status: '✅ Live API' },
                { value: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" />, available: false, status: '⏳ Pending' },
                { value: 'tiktok', label: 'TikTok', icon: <Search className="w-5 h-5" />, available: false, status: '⏳ Pending' }
              ].map((p) => (
                <div key={p.value} className="relative">
                  <button
                    onClick={() => setPlatform(p.value as any)}
                    disabled={!p.available}
                    className={`w-full flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      platform === p.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : p.available 
                          ? 'border-gray-200 hover:border-gray-300 text-gray-700' 
                          : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {p.icon}
                    <span className="font-medium">{p.label}</span>
                  </button>
                  <div className="text-xs text-center mt-1 text-gray-500">{p.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getInputLabel()}
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={analysis.isAnalyzing}
              />
              <button
                onClick={() => setUsername(getExampleData().value)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
              >
                {getExampleData().label}
              </button>
            </div>
            {(platform === 'youtube' || platform === 'twitter') && (
              <p className="text-sm text-gray-500 mt-1">
                💡 {platform === 'youtube' 
                  ? 'To find a YouTube Channel ID: Go to the channel → View Page Source → Search for "channelId"'
                  : 'Enter the Twitter username without the @ symbol'
                }
              </p>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={analysis.isAnalyzing || (platform !== 'youtube' && platform !== 'twitter')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
          >
            {analysis.isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing {platform} Account...
              </>
            ) : (
              <>
                Analyze {platform.charAt(0).toUpperCase() + platform.slice(1)} Account
              </>
            )}
          </button>

          {/* API Status Notice */}
          {(platform === 'instagram' || platform === 'tiktok') && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⏳ {platform === 'instagram' ? 'Instagram' : 'TikTok'} API integration is pending approval. 
                YouTube and Twitter analysis are currently available.
              </p>
            </div>
          )}

          {/* Results */}
          {analysis.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Analysis Failed</span>
              </div>
              <p className="text-red-700 mt-1">{analysis.error}</p>
            </div>
          )}

          {analysis.result && (
            <div className="mt-6 space-y-4">
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(analysis.result.riskLevel)}`}>
                <div className="flex items-center gap-3 mb-2">
                  {getRiskIcon(analysis.result.riskLevel)}
                  <div>
                    <h3 className="font-bold text-lg">Risk Level: {analysis.result.riskLevel}</h3>
                    <p className="text-sm opacity-75">
                      Bot Probability: {(analysis.result.botProbability * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="font-medium">{analysis.result.recommendation}</p>
              </div>

              {/* Account Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Platform:</span>
                    <span className="ml-2 font-medium capitalize">{analysis.result.platform}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Username:</span>
                    <span className="ml-2 font-medium">{analysis.result.username}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Analyzed:</span>
                    <span className="ml-2 font-medium">
                      {new Date(analysis.result.analysisDate).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {analysis.result.flags.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">⚠️ Detected Issues</h4>
                  <ul className="space-y-1">
                    {analysis.result.flags.map((flag: string, index: number) => (
                      <li key={index} className="text-yellow-700 text-sm">• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Analysis Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Analysis Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Profile Analysis:</span>
                    <span className="ml-2 font-medium">
                      {analysis.result.analysis.profileAnalysis.score || 0} points
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Engagement Analysis:</span>
                    <span className="ml-2 font-medium">
                      {analysis.result.analysis.engagementAnalysis.score || 0} points
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Content Analysis:</span>
                    <span className="ml-2 font-medium">
                      {analysis.result.analysis.contentAnalysis.score || 0} points
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
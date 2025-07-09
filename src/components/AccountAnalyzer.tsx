import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { BotAnalysisResult, SocialAccount, Platform } from '../types';
import { botAnalyzer } from './botDetection';

const AccountAnalyzer: React.FC = () => {
  const [accountHandle, setAccountHandle] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BotAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!accountHandle.trim()) {
      setError('Please enter an account handle');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const account: SocialAccount = {
        handle: accountHandle.trim(),
        platform: platform
      };

      console.log('Starting analysis for:', account);
      const result = await botAnalyzer.analyzeAccount(account);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <XCircle className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const getBotScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bot Detection Engine
        </h2>
        <p className="text-gray-600">
          Enter any social media account to analyze for bot-like behavior
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Handle
            </label>
            <input
              type="text"
              value={accountHandle}
              onChange={(e) => setAccountHandle(e.target.value)}
              placeholder="@username or handle"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isAnalyzing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isAnalyzing}
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter/X</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !accountHandle.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
        >
          {isAnalyzing ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              <span>Analyzing Account...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Analyze Account</span>
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Analysis Results for {analysisResult.account.handle}
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysisResult.riskLevel)} flex items-center space-x-1`}>
                {getRiskIcon(analysisResult.riskLevel)}
                <span>{analysisResult.riskLevel.toUpperCase()} RISK</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getBotScoreColor(analysisResult.botScore)}`}>
                  {analysisResult.botScore}%
                </div>
                <div className="text-sm text-gray-600">Bot Likelihood</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {analysisResult.confidence}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {analysisResult.processingTime.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">Processing Time</div>
              </div>
            </div>
          </div>

          {/* Account Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {analysisResult.metrics.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {analysisResult.metrics.following.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {analysisResult.metrics.engagementRate.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Engagement Rate</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-900">
                  {analysisResult.metrics.posts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Posts</div>
              </div>
            </div>
          </div>

          {/* Red Flags */}
          {analysisResult.redFlags.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Red Flags Detected</span>
              </h3>
              <ul className="space-y-2">
                {analysisResult.redFlags.map((flag, index) => (
                  <li key={index} className="text-red-700 flex items-start space-x-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Recommendations
            </h3>
            <ul className="space-y-2">
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index} className="text-blue-700 flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bot Detection Signals */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detection Signals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysisResult.signals).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${
                    value === 'normal' || value === 'organic' || value === 'good' || value === 'established' || value === 'complete'
                      ? 'bg-green-100 text-green-800'
                      : value === 'suspicious' || value === 'automated' || value === 'poor' || value === 'recent' || value === 'incomplete'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountAnalyzer;
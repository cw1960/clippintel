import React, { useState } from 'react';
import { Building2, Users, Search, Target, TrendingUp, Shield, Upload, Download, CheckCircle, XCircle, AlertTriangle, DollarSign, Clock } from 'lucide-react';
import AgencyCampaignManager from '../campaigns/AgencyCampaignManager';
import AccountAnalyzer from '../AccountAnalyzer';

type AgencyView = 'overview' | 'campaigns' | 'detection' | 'clients' | 'analytics';

const AgencyDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AgencyView>('overview');

  const AgencyNavigation = () => (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-gray-900">Agency Dashboard</h2>
            <p className="text-sm text-gray-600">Multi-Client Management</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'overview' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setCurrentView('campaigns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'campaigns' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Campaign Management</span>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">12</span>
          </button>
          
          <button
            onClick={() => setCurrentView('detection')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'detection' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Bulk Bot Detection</span>
          </button>
          
          <button
            onClick={() => setCurrentView('clients')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'clients' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Client Management</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'analytics' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Analytics & Reports</span>
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Total Fraud Prevented</h3>
          <div className="text-2xl font-bold text-green-700">$47,320</div>
          <p className="text-sm text-green-600">Across all clients</p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Agency Plan: Pro</h3>
          <div className="text-sm text-blue-700">$299/month</div>
          <p className="text-xs text-blue-600">Unlimited clients & campaigns</p>
          <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">Manage Billing</button>
        </div>
      </div>
    </div>
  );

  const OverviewView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Overview</h1>
          <p className="text-gray-600">Manage campaigns and creators across all your clients</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button 
            onClick={() => setCurrentView('campaigns')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Target className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* High-Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Clients</h3>
          <div className="text-3xl font-bold text-blue-600">8</div>
          <div className="text-sm text-blue-600">+2 this month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Budget Managed</h3>
          <div className="text-3xl font-bold text-green-600">$284K</div>
          <div className="text-sm text-green-600">Across all campaigns</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Creators Screened</h3>
          <div className="text-3xl font-bold text-purple-600">1,847</div>
          <div className="text-sm text-purple-600">This month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Fraud Prevented</h3>
          <div className="text-3xl font-bold text-red-600">$47K</div>
          <div className="text-sm text-red-600">16.5% of total budget</div>
        </div>
      </div>

      {/* Client Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Performing Clients</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">TechFlow Corp</h4>
                <p className="text-sm text-gray-600">Technology • 3 active campaigns</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">$95K</div>
              <div className="text-sm text-green-600">$12K fraud prevented</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">StyleBrand Fashion</h4>
                <p className="text-sm text-gray-600">Fashion • 2 active campaigns</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">$67K</div>
              <div className="text-sm text-green-600">$8K fraud prevented</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">FitLife Nutrition</h4>
                <p className="text-sm text-gray-600">Health & Fitness • 4 active campaigns</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">$52K</div>
              <div className="text-sm text-green-600">$7K fraud prevented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bot Detections</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">High-risk bot detected</p>
                <p className="text-xs text-gray-600">@fake_account_2024 • TechFlow campaign • 2 min ago</p>
              </div>
              <span className="text-sm text-red-600 font-medium">Blocked</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Suspicious engagement pattern</p>
                <p className="text-xs text-gray-600">@questionable_creator • StyleBrand campaign • 15 min ago</p>
              </div>
              <span className="text-sm text-yellow-600 font-medium">Review</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Verified creator approved</p>
                <p className="text-xs text-gray-600">@authentic_creator • FitLife campaign • 1 hour ago</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Approved</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Q4 Product Launch</p>
                <p className="text-sm text-gray-600">TechFlow Corp</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">89 approved</div>
                <div className="text-xs text-red-600">12 bots blocked</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Summer Collection</p>
                <p className="text-sm text-gray-600">StyleBrand Fashion</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">67 approved</div>
                <div className="text-xs text-red-600">8 bots blocked</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Fitness Challenge</p>
                <p className="text-sm text-gray-600">FitLife Nutrition</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">124 approved</div>
                <div className="text-xs text-red-600">15 bots blocked</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Scale Your Agency with ClippIntell</h3>
          <p className="text-gray-600 mb-6">
            Manage unlimited clients and campaigns while preventing fraud across your entire portfolio.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Bot Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$47K</div>
              <div className="text-sm text-gray-600">Fraud Prevented</div>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('campaigns')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start New Campaign
          </button>
        </div>
      </div>
    </div>
  );

  const BulkDetectionView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bulk Bot Detection</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>
      
      {/* Bulk Detection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Accounts Analyzed</h3>
          <div className="text-3xl font-bold text-blue-600">1,062</div>
          <div className="text-sm text-blue-600">This month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">High Risk Detected</h3>
          <div className="text-3xl font-bold text-red-600">127</div>
          <div className="text-sm text-red-600">12% of total</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Medium Risk</h3>
          <div className="text-3xl font-bold text-yellow-600">43</div>
          <div className="text-sm text-yellow-600">4% of total</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Low Risk</h3>
          <div className="text-3xl font-bold text-green-600">892</div>
          <div className="text-sm text-green-600">84% of total</div>
        </div>
      </div>
      
      <AccountAnalyzer />
    </div>
  );

  const ClientManagementView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Client Management</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Users className="w-4 h-4" />
          <span>Add Client</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Client Portfolio</h3>
        <div className="text-center py-12 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <p>Comprehensive client management coming soon</p>
          <p className="text-sm">Track client performance, billing, and campaign ROI</p>
        </div>
      </div>
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Agency Performance Analytics</h3>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" />
          <p>Advanced analytics dashboard coming soon</p>
          <p className="text-sm">Deep insights into client performance, ROI, and fraud prevention</p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'campaigns':
        return <AgencyCampaignManager />;
      case 'detection':
        return <BulkDetectionView />;
      case 'clients':
        return <ClientManagementView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <AgencyNavigation />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderView()}
      </div>
    </div>
  );
};

export default AgencyDashboard;
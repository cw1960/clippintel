import React, { useState } from 'react';
import { Award, Users, TrendingUp, Search, Upload, Download, Plus, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import AccountAnalyzer from '../AccountAnalyzer';
import CampaignCreationWizard from '../campaigns/CampaignCreationWizard';

type RewardsOwnerView = 'campaigns' | 'applicants' | 'detection' | 'analytics';

const RewardsOwnerDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<RewardsOwnerView>('campaigns');
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Product Launch',
      description: 'TikTok & Instagram content',
      status: 'Active',
      budget: 5000,
      applications: 67,
      approved: 42,
      rejected: 8,
      pending: 17,
      fraudPrevented: 1200,
      requiresCertification: true
    },
    {
      id: 2,
      name: 'Brand Awareness Push', 
      description: 'YouTube & TikTok clips',
      status: 'Active',
      budget: 3500,
      applications: 45,
      approved: 28,
      rejected: 4,
      pending: 13,
      fraudPrevented: 800,
      requiresCertification: false
    }
  ]);

  const handleCampaignCreated = (newCampaign: any) => {
    const campaignWithId = {
      ...newCampaign,
      id: Date.now(),
      status: 'Draft',
      applications: 0,
      approved: 0,
      rejected: 0,
      pending: 0,
      fraudPrevented: 0,
      requiresCertification: newCampaign.requirements.requireClippIntellCertification
    };
    setCampaigns(prev => [campaignWithId, ...prev]);
    
    // Show success message
    console.log('New campaign created:', campaignWithId);
  };

  const RewardsOwnerNavigation = () => (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="font-bold text-gray-900">Rewards Dashboard</h2>
            <p className="text-sm text-gray-600">Content Campaign Management</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('campaigns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'campaigns' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>My Campaigns</span>
          </button>
          
          <button
            onClick={() => setCurrentView('applicants')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'applicants' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Creator Applicants</span>
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">23</span>
          </button>
          
          <button
            onClick={() => setCurrentView('detection')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'detection' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Bot Detection</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'analytics' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Campaign Analytics</span>
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Fraud Prevented</h3>
          <div className="text-2xl font-bold text-green-700">$3,240</div>
          <p className="text-sm text-green-600">This month</p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Plan: Small Business</h3>
          <div className="text-sm text-blue-700">$79/month</div>
          <p className="text-xs text-blue-600">Up to 5 active campaigns</p>
          <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">Upgrade Plan</button>
        </div>
      </div>
    </div>
  );

  const MyCampaignsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Content Campaigns</h1>
        <button 
          onClick={() => setShowCampaignWizard(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Campaigns</h3>
          <div className="text-3xl font-bold text-green-600">{campaigns.filter(c => c.status === 'Active').length}</div>
          <div className="text-sm text-gray-600">Currently running</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Applications</h3>
          <div className="text-3xl font-bold text-blue-600">{campaigns.reduce((sum, c) => sum + c.applications, 0)}</div>
          <div className="text-sm text-blue-600">+23 this week</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Approved Creators</h3>
          <div className="text-3xl font-bold text-purple-600">{campaigns.reduce((sum, c) => sum + c.approved, 0)}</div>
          <div className="text-sm text-purple-600">60.5% approval rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Bots Blocked</h3>
          <div className="text-3xl font-bold text-red-600">{campaigns.reduce((sum, c) => sum + c.rejected, 0)}</div>
          <div className="text-sm text-red-600">10.2% of applications</div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-600">{campaign.description}</p>
                {campaign.requiresCertification && (
                  <div className="flex items-center space-x-1 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">ClippIntell Certified Only</span>
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                campaign.status === 'Active' 
                  ? 'bg-green-100 text-green-800'
                  : campaign.status === 'Draft'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Budget:</span>
                <span className="font-medium">${campaign.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Applications:</span>
                <span className="font-medium">{campaign.applications}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Approved:</span>
                <span className="font-medium text-green-600">{campaign.approved}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rejected (Bots):</span>
                <span className="font-medium text-red-600">{campaign.rejected}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pending Review:</span>
                <span className="font-medium text-yellow-600">{campaign.pending}</span>
              </div>
              {campaign.fraudPrevented > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fraud Prevented:</span>
                  <span className="font-medium text-green-600">${campaign.fraudPrevented.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
                Manage Campaign
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Analytics
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign CTA */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border border-green-200">
        <div className="text-center">
          <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Launch Another Campaign?</h3>
          <p className="text-gray-600 mb-6">Create engaging content campaigns and automatically screen for authentic creators.</p>
          <button 
            onClick={() => setShowCampaignWizard(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Create New Campaign
          </button>
        </div>
      </div>
    </div>
  );

  const CreatorApplicantsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Creator Applicants</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search applicants..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option>All Campaigns</option>
            {campaigns.map(campaign => (
              <option key={campaign.id}>{campaign.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div className="text-left">
              <div className="font-medium">Approve All Low Risk</div>
              <div className="text-sm text-gray-600">12 applicants ready</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <XCircle className="w-6 h-6 text-red-500" />
            <div className="text-left">
              <div className="font-medium">Reject All High Risk</div>
              <div className="text-sm text-gray-600">5 bots detected</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Upload className="w-6 h-6 text-blue-500" />
            <div className="text-left">
              <div className="font-medium">Bulk Analysis</div>
              <div className="text-sm text-gray-600">Upload creator list</div>
            </div>
          </button>
        </div>
      </div>

      {/* Applicant List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">MC</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@mike_content_pro</h3>
                <p className="text-sm text-gray-600">Applied to: Summer Product Launch</p>
                <div className="flex items-center space-x-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">ClippIntell Certified</span>
                </div>
              </div>
            </div>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              Low Risk
            </span>
          </div>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">Instagram</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium">127K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-medium text-green-600">4.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bot Risk Score:</span>
              <span className="font-medium text-green-600">8% (Low)</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
              Approve
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
              Reject
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">BF</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@bot_fake_account</h3>
                <p className="text-sm text-gray-600">Applied to: Brand Awareness Push</p>
                <div className="flex items-center space-x-1 mt-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600 font-medium">Not Certified</span>
                </div>
              </div>
            </div>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              High Risk
            </span>
          </div>
          
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">TikTok</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium">45K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-medium text-red-600">12.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bot Risk Score:</span>
              <span className="font-medium text-red-600">87% (High)</span>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-900">Bot Detected</span>
            </div>
            <p className="text-xs text-red-700 mt-1">
              High view velocity spikes, suspicious engagement patterns
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm">
              Reject Bot
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const BotDetectionView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bot Detection Tool</h1>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Upload className="w-4 h-4" />
            <span>Upload CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export Results</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detection Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-green-700">Low Risk</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">23</div>
            <div className="text-sm text-yellow-700">Medium Risk</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">15</div>
            <div className="text-sm text-red-700">High Risk</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$3,240</div>
            <div className="text-sm text-blue-700">Fraud Prevented</div>
          </div>
        </div>
      </div>
      
      <AccountAnalyzer />
    </div>
  );

  const CampaignAnalyticsView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Campaign Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Campaign Spend</h3>
          <div className="text-3xl font-bold text-gray-900">${campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}</div>
          <div className="text-sm text-green-600 mt-1">This month</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Creator Applications</h3>
          <div className="text-3xl font-bold text-blue-600">{campaigns.reduce((sum, c) => sum + c.applications, 0)}</div>
          <div className="text-sm text-blue-600 mt-1">+23 this week</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Approval Rate</h3>
          <div className="text-3xl font-bold text-green-600">60.5%</div>
          <div className="text-sm text-green-600 mt-1">Above average</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Bot Detection Rate</h3>
          <div className="text-3xl font-bold text-red-600">10.2%</div>
          <div className="text-sm text-red-600 mt-1">Saved ${campaigns.reduce((sum, c) => sum + c.fraudPrevented, 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" />
          <p>Detailed campaign analytics coming soon</p>
          <p className="text-sm">Track ROI, engagement rates, and creator performance</p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'campaigns':
        return <MyCampaignsView />;
      case 'applicants':
        return <CreatorApplicantsView />;
      case 'detection':
        return <BotDetectionView />;
      case 'analytics':
        return <CampaignAnalyticsView />;
      default:
        return <MyCampaignsView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <RewardsOwnerNavigation />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderView()}
      </div>

      {/* Campaign Creation Wizard */}
      <CampaignCreationWizard
        isOpen={showCampaignWizard}
        onClose={() => setShowCampaignWizard(false)}
        onCampaignCreated={handleCampaignCreated}
      />
    </div>
  );
};

export default RewardsOwnerDashboard;
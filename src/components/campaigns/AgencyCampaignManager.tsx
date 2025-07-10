import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Users, DollarSign, Shield, TrendingUp, CheckCircle, XCircle, AlertTriangle, Building2, Target } from 'lucide-react';
import CampaignCreationWizard from './CampaignCreationWizard';

interface Client {
  id: number;
  name: string;
  industry: string;
  totalBudget: number;
  activeCampaigns: number;
  fraudPrevented: number;
}

interface AgencyCampaign {
  id: number;
  name: string;
  client: string;
  budget: number;
  status: 'Active' | 'Draft' | 'Completed' | 'Paused';
  applications: number;
  approved: number;
  rejected: number;
  fraudPrevented: number;
  requiresCertification: boolean;
  platforms: string[];
  createdDate: string;
}

const AgencyCampaignManager: React.FC = () => {
  const [showCampaignWizard, setShowCampaignWizard] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: 'TechFlow Corp',
      industry: 'Technology',
      totalBudget: 50000,
      activeCampaigns: 3,
      fraudPrevented: 7500
    },
    {
      id: 2,
      name: 'StyleBrand Fashion',
      industry: 'Fashion',
      totalBudget: 35000,
      activeCampaigns: 2,
      fraudPrevented: 5200
    },
    {
      id: 3,
      name: 'FitLife Nutrition',
      industry: 'Health & Fitness',
      totalBudget: 25000,
      activeCampaigns: 4,
      fraudPrevented: 3800
    }
  ]);

  const [campaigns, setCampaigns] = useState<AgencyCampaign[]>([
    {
      id: 1,
      name: 'Q4 Product Launch',
      client: 'TechFlow Corp',
      budget: 15000,
      status: 'Active',
      applications: 89,
      approved: 52,
      rejected: 12,
      fraudPrevented: 2400,
      requiresCertification: true,
      platforms: ['Instagram', 'TikTok'],
      createdDate: '2025-01-15'
    },
    {
      id: 2,
      name: 'Summer Collection',
      client: 'StyleBrand Fashion',
      budget: 12000,
      status: 'Active',
      applications: 67,
      approved: 45,
      rejected: 8,
      fraudPrevented: 1800,
      requiresCertification: true,
      platforms: ['Instagram', 'YouTube'],
      createdDate: '2025-01-20'
    },
    {
      id: 3,
      name: 'New Year Fitness Challenge',
      client: 'FitLife Nutrition',
      budget: 8000,
      status: 'Active',
      applications: 124,
      approved: 78,
      rejected: 15,
      fraudPrevented: 1200,
      requiresCertification: false,
      platforms: ['TikTok', 'YouTube'],
      createdDate: '2025-01-10'
    },
    {
      id: 4,
      name: 'Brand Awareness Push',
      client: 'TechFlow Corp',
      budget: 10000,
      status: 'Draft',
      applications: 0,
      approved: 0,
      rejected: 0,
      fraudPrevented: 0,
      requiresCertification: true,
      platforms: ['Instagram', 'Twitter/X'],
      createdDate: '2025-01-25'
    }
  ]);

  const handleCampaignCreated = (newCampaign: any) => {
    const campaignWithId: AgencyCampaign = {
      ...newCampaign,
      id: Date.now(),
      client: newCampaign.client || clients[0].name,
      status: 'Draft',
      applications: 0,
      approved: 0,
      rejected: 0,
      fraudPrevented: 0,
      requiresCertification: newCampaign.requirements.requireClippIntellCertification,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setCampaigns(prev => [campaignWithId, ...prev]);
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesClient = selectedClient === 'all' || campaign.client === selectedClient;
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesClient && matchesSearch && matchesStatus;
  });

  const totalStats = campaigns.reduce((acc, campaign) => ({
    totalBudget: acc.totalBudget + campaign.budget,
    totalApplications: acc.totalApplications + campaign.applications,
    totalApproved: acc.totalApproved + campaign.approved,
    totalRejected: acc.totalRejected + campaign.rejected,
    totalFraudPrevented: acc.totalFraudPrevented + campaign.fraudPrevented
  }), { totalBudget: 0, totalApplications: 0, totalApproved: 0, totalRejected: 0, totalFraudPrevented: 0 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
          <p className="text-gray-600">Manage campaigns across all your clients with advanced bot protection</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
          <button 
            onClick={() => setShowCampaignWizard(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Agency Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Budget Managed</h3>
          <div className="text-3xl font-bold text-blue-600">${totalStats.totalBudget.toLocaleString()}</div>
          <div className="text-sm text-blue-600">Across {clients.length} clients</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Creator Applications</h3>
          <div className="text-3xl font-bold text-purple-600">{totalStats.totalApplications}</div>
          <div className="text-sm text-purple-600">+47 this week</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Approved Creators</h3>
          <div className="text-3xl font-bold text-green-600">{totalStats.totalApproved}</div>
          <div className="text-sm text-green-600">
            {totalStats.totalApplications > 0 ? Math.round((totalStats.totalApproved / totalStats.totalApplications) * 100) : 0}% approval rate
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Bots Blocked</h3>
          <div className="text-3xl font-bold text-red-600">{totalStats.totalRejected}</div>
          <div className="text-sm text-red-600">
            {totalStats.totalApplications > 0 ? Math.round((totalStats.totalRejected / totalStats.totalApplications) * 100) : 0}% bot rate
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Fraud Prevented</h3>
          <div className="text-3xl font-bold text-green-600">${totalStats.totalFraudPrevented.toLocaleString()}</div>
          <div className="text-sm text-green-600">This month</div>
        </div>
      </div>

      {/* Client Performance Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Client Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clients.map(client => (
            <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <Building2 className="w-8 h-8 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-gray-900">{client.name}</h4>
                  <p className="text-sm text-gray-600">{client.industry}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Budget:</span>
                  <span className="font-medium">${client.totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Campaigns:</span>
                  <span className="font-medium">{client.activeCampaigns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fraud Prevented:</span>
                  <span className="font-medium text-green-600">${client.fraudPrevented.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                View Campaigns
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search campaigns or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.name}>{client.name}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Client: {campaign.client}</span>
                    <span>•</span>
                    <span>Platforms: {campaign.platforms.join(', ')}</span>
                    <span>•</span>
                    <span>Created: {campaign.createdDate}</span>
                  </div>
                  {campaign.requiresCertification && (
                    <div className="flex items-center space-x-1 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">ClippIntell Certification Required</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'Active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                  campaign.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">${campaign.budget.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Budget</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{campaign.applications}</div>
                <div className="text-xs text-gray-600">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{campaign.approved}</div>
                <div className="text-xs text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{campaign.rejected}</div>
                <div className="text-xs text-gray-600">Rejected</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {campaign.applications > 0 ? Math.round((campaign.approved / campaign.applications) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-600">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">${campaign.fraudPrevented.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Fraud Prevented</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {campaign.fraudPrevented > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>Protected ${campaign.fraudPrevented.toLocaleString()} from fraud</span>
                  </div>
                )}
                {!campaign.requiresCertification && campaign.rejected > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Consider requiring ClippIntell certification</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  Manage
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Analytics
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Value Proposition CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Maximize Client ROI with ClippIntell Certification</h3>
          <p className="text-gray-600 mb-6">
            Campaigns requiring ClippIntell certification see 85% fewer bot applications and 3x faster approval rates.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">85%</div>
              <div className="text-sm text-gray-600">Fewer Bot Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">Faster Approvals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${totalStats.totalFraudPrevented.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Fraud Prevented</div>
            </div>
          </div>
          <button 
            onClick={() => setShowCampaignWizard(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-4"
          >
            Create Certified Campaign
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
            Learn More
          </button>
        </div>
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

export default AgencyCampaignManager;
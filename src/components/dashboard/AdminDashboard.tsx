import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye,
  Settings,
  BarChart3,
  UserCheck,
  CreditCard,
  Flag,
  Search,
  Filter
} from 'lucide-react';

type AdminView = 'overview' | 'users' | 'verifications' | 'revenue' | 'campaigns' | 'analytics' | 'settings';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');

  const AdminNavigation = () => (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-600">Platform Management & Oversight</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'overview' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Platform Overview</span>
          </button>
          
          <button
            onClick={() => setCurrentView('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'users' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </button>
          
          <button
            onClick={() => setCurrentView('verifications')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'verifications' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-5 h-5" />
            <span>Verification Queue</span>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
          </button>
          
          <button
            onClick={() => setCurrentView('revenue')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'revenue' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Revenue & Billing</span>
          </button>
          
          <button
            onClick={() => setCurrentView('campaigns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'campaigns' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Flag className="w-5 h-5" />
            <span>Campaign Oversight</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'analytics' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Platform Analytics</span>
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'settings' 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Platform Settings</span>
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">Platform Health</h3>
          <div className="text-2xl font-bold text-green-700">98.9%</div>
          <p className="text-sm text-green-600">Uptime this month</p>
        </div>
      </div>
    </div>
  );

  const PlatformOverview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
              <div className="text-3xl font-bold text-gray-900">2,847</div>
              <div className="text-sm text-green-600 mt-1">+142 this week</div>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Revenue</h3>
              <div className="text-3xl font-bold text-gray-900">$23,840</div>
              <div className="text-sm text-green-600 mt-1">+18% from last month</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Verified Creators</h3>
              <div className="text-3xl font-bold text-gray-900">1,284</div>
              <div className="text-sm text-purple-600 mt-1">45% of creators</div>
            </div>
            <UserCheck className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Fraud Prevented</h3>
              <div className="text-3xl font-bold text-gray-900">$127K</div>
              <div className="text-sm text-red-600 mt-1">This month</div>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">High bot activity detected</p>
                <p className="text-xs text-red-600">Campaign: Summer UGC - 15 bot accounts flagged</p>
              </div>
              <span className="text-xs text-red-500">2m ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">Payment failure</p>
                <p className="text-xs text-yellow-600">User verification payment declined</p>
              </div>
              <span className="text-xs text-yellow-500">5m ago</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">New agency signup</p>
                <p className="text-xs text-blue-600">ContentCorp joined enterprise plan</p>
              </div>
              <span className="text-xs text-blue-500">12m ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Bot Detection Accuracy</span>
                <span className="font-medium">97.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.2%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Creator Verification Rate</span>
                <span className="font-medium">45.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45.1%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Agency Satisfaction</span>
                <span className="font-medium">94.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94.8%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
            <option>All Users</option>
            <option>Agencies</option>
            <option>Creators</option>
            <option>Verified Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">AC</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">AgencyCorpInc</div>
                    <div className="text-sm text-gray-500">agency@corp.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Agency
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Enterprise
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$2,500/mo</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-red-600 hover:text-red-900 mr-3">View</button>
                <button className="text-gray-600 hover:text-gray-900">Edit</button>
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">MC</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">@mike_creator</div>
                    <div className="text-sm text-gray-500">mike@email.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  Creator
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Verified
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 8, 2024</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$7</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-red-600 hover:text-red-900 mr-3">View</button>
                <button className="text-gray-600 hover:text-gray-900">Edit</button>
              </td>
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">SK</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">@sarah_clips</div>
                    <div className="text-sm text-gray-500">sarah@email.com</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  Creator
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 20, 2025</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">$0</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-red-600 hover:text-red-900 mr-3">View</button>
                <button className="text-gray-600 hover:text-gray-900">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const VerificationQueue = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
          12 Pending Reviews
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">@content_creator_pro</h3>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Premium Verification</span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">Instagram</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium">156K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-medium text-green-600">4.8%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bot Risk Score:</span>
              <span className="font-medium text-green-600">8% (Low)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment:</span>
              <span className="font-medium text-green-600">$7 Received</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">@clipper_supreme</h3>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Standard Verification</span>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium">TikTok</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Followers:</span>
              <span className="font-medium">89K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement Rate:</span>
              <span className="font-medium text-green-600">6.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bot Risk Score:</span>
              <span className="font-medium text-yellow-600">23% (Medium)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment:</span>
              <span className="font-medium text-green-600">$3 Received</span>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const RevenueManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Billing</h1>
        <div className="text-sm text-gray-600">
          Total Revenue: <span className="font-bold text-green-600">$287,420</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Creator Verifications</h3>
            <CreditCard className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">$8,420</div>
          <div className="text-sm text-gray-600">This month</div>
          <div className="text-xs text-green-600 mt-1">+32% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Agency Subscriptions</h3>
            <DollarSign className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">$15,000</div>
          <div className="text-sm text-gray-600">Monthly recurring</div>
          <div className="text-xs text-green-600 mt-1">+18% from last month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Fees</h3>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">$2,840</div>
          <div className="text-sm text-gray-600">This month</div>
          <div className="text-xs text-green-600 mt-1">+25% from last month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 22, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">@mike_creator</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Premium Verification</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$7</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 22, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">AgencyCorpInc</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Enterprise Subscription</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$2,500</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jan 21, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">@sarah_clips</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Standard Verification</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">$3</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PlatformAnalytics = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Bot Detection Rate</h3>
          <div className="text-3xl font-bold text-red-600">10.2%</div>
          <div className="text-sm text-gray-600 mt-1">Of analyzed accounts</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Verification Conversion</h3>
          <div className="text-3xl font-bold text-purple-600">45.1%</div>
          <div className="text-sm text-gray-600 mt-1">Creators who verify</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Agency Retention</h3>
          <div className="text-3xl font-bold text-blue-600">94.8%</div>
          <div className="text-sm text-gray-600 mt-1">Monthly retention rate</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Platform Growth</h3>
          <div className="text-3xl font-bold text-green-600">+23%</div>
          <div className="text-sm text-gray-600 mt-1">User growth this month</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Usage Trends</h3>
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>Analytics charts would be integrated here</p>
          <p className="text-sm">Connect to analytics service for detailed insights</p>
        </div>
      </div>
    </div>
  );

  const PlatformSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Verification Pricing</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standard Verification</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">$</span>
                <input type="number" value="3" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                <span className="text-gray-500">per verification</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Premium Verification</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">$</span>
                <input type="number" value="7" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                <span className="text-gray-500">per verification</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Bot Detection Thresholds</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">High Risk Threshold</label>
              <div className="flex items-center space-x-2">
                <input type="number" value="70" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                <span className="text-gray-500">% bot score</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medium Risk Threshold</label>
              <div className="flex items-center space-x-2">
                <input type="number" value="40" className="w-20 px-3 py-2 border border-gray-300 rounded-lg" />
                <span className="text-gray-500">% bot score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Platform Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">High Bot Activity Alerts</h4>
              <p className="text-sm text-gray-600">Notify when bot detection rate exceeds 15%</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Revenue Milestones</h4>
              <p className="text-sm text-gray-600">Alert when monthly revenue targets are hit</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <PlatformOverview />;
      case 'users':
        return <UserManagement />;
      case 'verifications':
        return <VerificationQueue />;
      case 'revenue':
        return <RevenueManagement />;
      case 'analytics':
        return <PlatformAnalytics />;
      case 'settings':
        return <PlatformSettings />;
      default:
        return <PlatformOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Navigation Sidebar */}
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderView()}
      </div>
    </div>
  );
};

export default AdminDashboard;
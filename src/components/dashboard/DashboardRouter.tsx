import React, { useState } from 'react';
import { Shield, Users, Award, TrendingUp, Upload, Download, Search, Star } from 'lucide-react';
import { useAuth } from '../auth/AuthWrapper';
import AccountAnalyzer from '../AccountAnalyzer';

type UserType = 'agency' | 'creator';
type DashboardView = 'detection' | 'campaigns' | 'certification' | 'marketplace' | 'analytics';

const DashboardRouter: React.FC = () => {
  const { userRole, setUserRole } = useAuth();
  const userType = userRole || 'agency';
  const [currentView, setCurrentView] = useState<DashboardView>(userRole === 'creator' ? 'certification' : 'detection');

  const AgencyNavigation = () => (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-bold text-gray-900">Agency Dashboard</h2>
            <p className="text-sm text-gray-600">Bot Detection & Campaign Management</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('detection')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'detection' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Bot Detection</span>
          </button>
          
          <button
            onClick={() => setCurrentView('campaigns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'campaigns' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Campaign Management</span>
          </button>
          
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'marketplace' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Star className="w-5 h-5" />
            <span>Verified Creators</span>
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
          <h3 className="font-medium text-green-900 mb-2">Protected This Month</h3>
          <div className="text-2xl font-bold text-green-700">$47,320</div>
          <p className="text-sm text-green-600">Prevented bot payouts</p>
        </div>
      </div>
    </div>
  );

  const CreatorNavigation = () => (
    <div className="bg-white shadow-sm border-r border-gray-200 w-64 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="font-bold text-gray-900">Creator Dashboard</h2>
            <p className="text-sm text-gray-600">Account Certification & Opportunities</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView('certification')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'certification' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Get Verified</span>
          </button>
          
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'marketplace' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Available Campaigns</span>
          </button>
          
          <button
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
              currentView === 'analytics' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>My Performance</span>
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-900 mb-2">Verification Status</h3>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-sm text-purple-700">Pending Review</span>
          </div>
          <p className="text-sm text-purple-600">2-3 business days remaining</p>
        </div>
      </div>
    </div>
  );

  const BulkAnalysisView = () => (
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
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">127</div>
            <div className="text-sm text-red-700">High Risk Detected</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">43</div>
            <div className="text-sm text-yellow-700">Medium Risk</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">892</div>
            <div className="text-sm text-green-700">Low Risk</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$52,430</div>
            <div className="text-sm text-blue-700">Fraud Prevented</div>
          </div>
        </div>
      </div>
      
      <AccountAnalyzer />
    </div>
  );

  const CampaignManagementView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create New Campaign
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Summer UGC Campaign</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Applications:</span>
              <span className="font-medium">1,247</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved:</span>
              <span className="font-medium text-green-600">892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rejected (Bots):</span>
              <span className="font-medium text-red-600">127</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Under Review:</span>
              <span className="font-medium text-yellow-600">228</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bot Detection Rate:</span>
              <span className="font-medium">10.2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Holiday Clips Contest</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Applications:</span>
              <span className="font-medium">892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved:</span>
              <span className="font-medium text-green-600">743</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rejected (Bots):</span>
              <span className="font-medium text-red-600">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Under Review:</span>
              <span className="font-medium text-yellow-600">60</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bot Detection Rate:</span>
              <span className="font-medium">10.0%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Q1 Brand Awareness</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Applications:</span>
              <span className="font-medium">2,156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approved:</span>
              <span className="font-medium text-green-600">1,892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rejected (Bots):</span>
              <span className="font-medium text-red-600">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Under Review:</span>
              <span className="font-medium text-yellow-600">30</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bot Detection Rate:</span>
              <span className="font-medium">10.9%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bot Detection Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <span className="font-medium text-red-900">@fake_viral_bot_2024</span>
                <span className="text-sm text-red-700 ml-2">- High risk bot detected</span>
              </div>
            </div>
            <span className="text-sm text-red-600">2 minutes ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <span className="font-medium text-yellow-900">@suspicious_account_23</span>
                <span className="text-sm text-yellow-700 ml-2">- Manual review needed</span>
              </div>
            </div>
            <span className="text-sm text-yellow-600">15 minutes ago</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <span className="font-medium text-red-900">@bot_farm_account</span>
                <span className="text-sm text-red-700 ml-2">- Geographic clustering detected</span>
              </div>
            </div>
            <span className="text-sm text-red-600">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const CreatorCertificationView = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Get ClippIntell Verified</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Stand out to agencies with our verification badge. Verified creators get priority access to high-paying campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Standard Verification</h3>
            <div className="text-3xl font-bold text-purple-600 mt-2">$3</div>
            <p className="text-gray-600 mt-2">One-time verification fee</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Account authenticity verification</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">ClippIntell verified badge</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Priority campaign access</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Performance analytics</span>
            </li>
          </ul>
          
          <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
            Start Verification
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-2 border-purple-200">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Premium Verification</h3>
            <div className="text-3xl font-bold text-purple-600 mt-2">$7</div>
            <p className="text-gray-600 mt-2">Enhanced verification package</p>
            <div className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full inline-block mt-2">
              RECOMMENDED
            </div>
          </div>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Everything in Standard</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Cross-platform verification</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Premium badge & profile boost</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Dedicated support channel</span>
            </li>
            <li className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">Early campaign access</span>
            </li>
          </ul>
          
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700">
            Get Premium Verification
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">Why Get Verified?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">3.2x</div>
            <div className="text-sm text-blue-600">Higher acceptance rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">$847</div>
            <div className="text-sm text-blue-600">Average monthly earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-700">48hrs</div>
            <div className="text-sm text-blue-600">Faster campaign approval</div>
          </div>
        </div>
      </div>
    </div>
  );

  const VerifiedCreatorMarketplace = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {userType === 'agency' ? 'Verified Creator Marketplace' : 'Available Campaigns'}
        </h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search creators..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Platforms</option>
            <option>Instagram</option>
            <option>TikTok</option>
            <option>YouTube</option>
          </select>
        </div>
      </div>

      {userType === 'agency' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">MC</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@mike_creator</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-purple-500 fill-current" />
                  <span className="text-sm text-purple-600">Premium Verified</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Followers:</span>
                <span className="font-medium">127K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-green-600">4.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Campaigns:</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bot Risk Score:</span>
                <span className="font-medium text-green-600">2% (Low)</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Invite to Campaign
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">SK</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@sarah_clips</h3>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600">Standard Verified</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Followers:</span>
                <span className="font-medium">89K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-green-600">3.8%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Campaigns:</span>
                <span className="font-medium">17</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bot Risk Score:</span>
                <span className="font-medium text-green-600">5% (Low)</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Invite to Campaign
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Profile
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">DJ</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">@david_content</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-purple-500 fill-current" />
                  <span className="text-sm text-purple-600">Premium Verified</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Followers:</span>
                <span className="font-medium">203K</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Engagement Rate:</span>
                <span className="font-medium text-green-600">5.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed Campaigns:</span>
                <span className="font-medium">31</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bot Risk Score:</span>
                <span className="font-medium text-green-600">1% (Low)</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                Invite to Campaign
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                View Profile
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Summer UGC Campaign</h3>
                <p className="text-sm text-gray-600">FashionBrand Inc.</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">$250</div>
                <div className="text-sm text-gray-600">per video</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">
              Create engaging UGC content featuring our summer collection. Looking for authentic creators with strong engagement.
            </p>
            
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>📋 Requirements: 50K+ followers</span>
              <span>📅 Deadline: July 15</span>
            </div>
            
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Apply Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Tech Product Review</h3>
                <p className="text-sm text-gray-600">TechGadgets Co.</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">$400</div>
                <div className="text-sm text-gray-600">per review</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">
              Honest reviews of our latest smartphone accessory. Perfect for tech-focused creators.
            </p>
            
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>📋 Requirements: Tech niche</span>
              <span>📅 Deadline: July 20</span>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const AnalyticsView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {userType === 'agency' ? 'Bot Detection Analytics' : 'Creator Performance Analytics'}
      </h1>
      
      {userType === 'agency' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Accounts Analyzed</h3>
            <div className="text-3xl font-bold text-gray-900">12,847</div>
            <div className="text-sm text-green-600 mt-1">+23% this month</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Bots Detected</h3>
            <div className="text-3xl font-bold text-red-600">1,284</div>
            <div className="text-sm text-gray-600 mt-1">10.0% detection rate</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Fraud Prevented</h3>
            <div className="text-3xl font-bold text-green-600">$127K</div>
            <div className="text-sm text-green-600 mt-1">+$23K this month</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Detection Accuracy</h3>
            <div className="text-3xl font-bold text-blue-600">97.2%</div>
            <div className="text-sm text-blue-600 mt-1">Industry leading</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Campaign Applications</h3>
            <div className="text-3xl font-bold text-gray-900">47</div>
            <div className="text-sm text-green-600 mt-1">+12 this month</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Acceptance Rate</h3>
            <div className="text-3xl font-bold text-green-600">89%</div>
            <div className="text-sm text-green-600 mt-1">Above average</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Earnings</h3>
            <div className="text-3xl font-bold text-purple-600">$3,420</div>
            <div className="text-sm text-purple-600 mt-1">This month</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Verification Status</h3>
            <div className="text-3xl font-bold text-blue-600">✓</div>
            <div className="text-sm text-blue-600 mt-1">Premium Verified</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderView = () => {
    if (userType === 'agency') {
      switch (currentView) {
        case 'detection':
          return <BulkAnalysisView />;
        case 'campaigns':
          return <CampaignManagementView />;
        case 'marketplace':
          return <VerifiedCreatorMarketplace />;
        case 'analytics':
          return <AnalyticsView />;
        default:
          return <BulkAnalysisView />;
      }
    } else {
      switch (currentView) {
        case 'certification':
          return <CreatorCertificationView />;
        case 'marketplace':
          return <VerifiedCreatorMarketplace />;
        case 'analytics':
          return <AnalyticsView />;
        default:
          return <CreatorCertificationView />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* User Type Switcher */}
      <div className="fixed top-20 right-6 z-10">
        <div className="bg-white rounded-lg shadow-lg p-2 border">
          <div className="flex space-x-1">
            <button
              onClick={() => {
                setUserRole('agency');
                setCurrentView('detection');
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                userType === 'agency'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Agency View
            </button>
            <button
              onClick={() => {
                setUserRole('creator');
                setCurrentView('certification');
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                userType === 'creator'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Creator View
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sidebar */}
      {userType === 'agency' ? <AgencyNavigation /> : <CreatorNavigation />}

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderView()}
      </div>
    </div>
  );
};

export default DashboardRouter;
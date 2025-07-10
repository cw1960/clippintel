import React, { useState } from 'react';
import { Shield, Users, Award, TrendingUp, Upload, Download, Search, Star } from 'lucide-react';
import { useAuth } from '../auth/AuthWrapper';
import AdminDashboard from './AdminDashboard';
import RewardsOwnerDashboard from './RewardsOwnerDashboard';
import AgencyDashboard from './AgencyDashboard';
import AccountAnalyzer from '../AccountAnalyzer';

type UserType = 'agency' | 'creator';
type DashboardView = 'detection' | 'campaigns' | 'certification' | 'marketplace' | 'analytics';

const DashboardRouter: React.FC = () => {
  const { userRole, setUserRole } = useAuth();
  const userType = userRole || 'agency';
  const [currentView, setCurrentView] = useState<DashboardView>(userRole === 'creator' ? 'certification' : 'detection');

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
        <h1 className="text-2xl font-bold text-gray-900">Available Campaigns</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search campaigns..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Summer UGC Campaign</h3>
              <p className="text-sm text-gray-600">FashionBrand Inc.</p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">ClippIntell Certification Required</span>
              </div>
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
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">ClippIntell Certification Required</span>
              </div>
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

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Fitness Challenge Series</h3>
              <p className="text-sm text-gray-600">FitLife Nutrition</p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="w-3 h-3 text-purple-500" />
                <span className="text-xs text-purple-600 font-medium">ClippIntell Certification Required</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">$350</div>
              <div className="text-sm text-gray-600">per post</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Document your fitness journey with our nutrition products. Looking for authentic fitness enthusiasts.
          </p>
          
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>📋 Requirements: Fitness niche</span>
            <span>📅 Deadline: July 25</span>
          </div>
          
          <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Apply Now
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Travel Content Series</h3>
              <p className="text-sm text-gray-600">Wanderlust Travel Co.</p>
              <div className="flex items-center space-x-1 mt-1">
                <Shield className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-600 font-medium">ClippIntell Certification Required</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">$500</div>
              <div className="text-sm text-gray-600">per destination</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Create stunning travel content showcasing unique destinations. Perfect for travel and lifestyle creators.
          </p>
          
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>📋 Requirements: 100K+ followers</span>
            <span>📅 Deadline: August 1</span>
          </div>
          
          <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700">
            Apply Now
          </button>
        </div>
      </div>

      {/* Value Proposition for Creators */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8 border border-purple-200">
        <div className="text-center">
          <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Why These Campaigns Require ClippIntell Certification</h3>
          <p className="text-gray-600 mb-6">
            Brands are choosing certified creators to ensure authentic engagement and protect their marketing investments.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">85%</div>
              <div className="text-sm text-gray-600">Higher Pay Rates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">3x</div>
              <div className="text-sm text-gray-600">Faster Approval</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">Priority</div>
              <div className="text-sm text-gray-600">Campaign Access</div>
            </div>
          </div>
          <button 
            onClick={() => setCurrentView('certification')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            Get Certified Now
          </button>
        </div>
      </div>
    </div>
  );

  const CreatorAnalyticsView = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Creator Performance Analytics</h1>
      
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

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" />
          <p>Detailed performance analytics coming soon</p>
          <p className="text-sm">Track your campaign success, earnings trends, and engagement metrics</p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    if (userType === 'admin') {
      return <AdminDashboard />;
    } else if (userType === 'rewards_owner') {
      return <RewardsOwnerDashboard />;
    } else if (userType === 'agency') {
      // Use the new comprehensive Agency Dashboard
      return <AgencyDashboard />;
    } else {
      // Creator views
      switch (currentView) {
        case 'certification':
          return <CreatorCertificationView />;
        case 'marketplace':
          return <VerifiedCreatorMarketplace />;
        case 'analytics':
          return <CreatorAnalyticsView />;
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
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                setUserRole('agency');
                setCurrentView('detection');
              }}
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                userType === 'agency'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Agency
            </button>
            <button
              onClick={() => {
                setUserRole('rewards_owner');
                setCurrentView('campaigns');
              }}
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                userType === 'rewards_owner'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Rewards
            </button>
            <button
              onClick={() => {
                setUserRole('creator');
                setCurrentView('certification');
              }}
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                userType === 'creator'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Creator
            </button>
            <button
              onClick={() => {
                setUserRole('admin');
                setCurrentView('overview');
              }}
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                userType === 'admin'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sidebar - Only for Creator (Agency uses its own internal navigation) */}
      {userType === 'creator' && <CreatorNavigation />}

      {/* Main Content */}
      <div className="flex-1 p-8">
        {renderView()}
      </div>
    </div>
  );
};

export default DashboardRouter;
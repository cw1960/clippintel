import React, { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, authHelpers } from './supabase';
import { LogIn, UserPlus, LogOut, Mail, Lock, User as UserIcon, Building2, Shield, Award } from 'lucide-react';

type UserRole = 'agency' | 'creator' | 'admin' | 'rewards_owner' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  setUserRole: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    // Check current user
    authHelpers.getCurrentUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Get user role from localStorage or database
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) {
          setUserRole(savedRole);
        } else {
          setShowRoleSelection(true);
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setUserRole(null);
        localStorage.removeItem('userRole');
        setShowRoleSelection(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);

    try {
      if (authMode === 'signup') {
        const { error } = await authHelpers.signUp(email, password);
        if (error) throw error;
        setError('Check your email for the confirmation link!');
      } else {
        const { error } = await authHelpers.signIn(email, password);
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('userRole', role!);
    setShowRoleSelection(false);
  };

  const handleSignOut = async () => {
    await authHelpers.signOut();
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ClippIntell...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ClippIntell</h1>
            <p className="text-gray-600">AI-Powered Bot Detection for Content Campaigns</p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 px-4 text-center rounded-l-md ${
                  authMode === 'signin' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 px-4 text-center rounded-r-md ${
                  authMode === 'signup' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {error && (
                <div className={`p-3 rounded-md text-sm ${
                  error.includes('Check your email') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {authLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {authMode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    <span>{authMode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                  </>
                )}
              </button>
            </form>

            {authMode === 'signup' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-900 mb-2">Join the Platform:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Agencies:</strong> Detect bots, save money, access verified creators</li>
                  <li>• <strong>Creators:</strong> Get verified, access premium campaigns</li>
                  <li>• <strong>Both:</strong> Join the fight against $1.3B in fraud</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>Protecting campaigns from $1.3B in annual bot fraud</p>
          </div>
        </div>
      </div>
    );
  }

  // Show role selection if user is authenticated but no role selected
  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ClippIntell!</h1>
            <p className="text-gray-600">Choose your role to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Agency Owner */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all"
                 onClick={() => handleRoleSelection('agency')}>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Agency Owner</h3>
                <p className="text-gray-600 mb-6">Detect bots, manage campaigns, access verified creators</p>
                
                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Advanced bot detection</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Campaign management</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Fraud prevention analytics</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Verified creator marketplace</span>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  Continue as Agency
                </button>
              </div>
            </div>

            {/* Content Rewards Program Owner */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-green-500 cursor-pointer transition-all"
                 onClick={() => handleRoleSelection('rewards_owner')}>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Rewards Owner</h3>
                <p className="text-gray-600 mb-6">Run your own content campaigns, screen creators, prevent fraud</p>
                
                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Create & manage your campaigns</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Screen creator applications</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Bot detection for applicants</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Small business pricing</span>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
                  Continue as Rewards Owner
                </button>
              </div>
            </div>

            {/* Creator */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-purple-500 cursor-pointer transition-all"
                 onClick={() => handleRoleSelection('creator')}>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Creator</h3>
                <p className="text-gray-600 mb-6">Get verified, access premium campaigns, boost credibility</p>
                
                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Account verification badges</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Premium campaign access</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Stand out from 800K+ creators</span>
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700">
                  Continue as Creator
                </button>
              </div>
            </div>

            {/* Admin Role */}
            <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-transparent hover:border-red-500 cursor-pointer transition-all"
                 onClick={() => handleRoleSelection('admin')}>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Admin</h3>
                <p className="text-gray-600 mb-6">Manage users, oversee platform, track revenue</p>
                
                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>User management & verification</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Revenue & analytics dashboard</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Campaign oversight</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>•</span>
                    <span>Platform health monitoring</span>
                  </div>
                </div>

                <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700">
                  Continue as Admin
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">You can change your role anytime in settings</p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated with role selected
  return (
    <AuthContext.Provider value={{ user, userRole, setUserRole }}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">ClippIntell</h1>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userRole === 'agency' 
                    ? 'bg-blue-100 text-blue-700' 
                    : userRole === 'creator'
                    ? 'bg-purple-100 text-purple-700'
                    : userRole === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {userRole === 'agency' ? 'Agency' : 
                   userRole === 'creator' ? 'Creator' : 
                   userRole === 'admin' ? 'Admin' : 
                   'Rewards Owner'}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={() => setShowRoleSelection(true)}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Switch Role
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default AuthWrapper;
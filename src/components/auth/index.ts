// Authentication Components
export { LoginForm } from './LoginForm';
export { SignupForm } from './SignupForm';
export { ProtectedRoute, useProtectedRoute } from './ProtectedRoute';
export { AuthLayout } from './AuthLayout';

// Re-export default components
export { default as LoginFormDefault } from './LoginForm';
export { default as SignupFormDefault } from './SignupForm';
export { default as ProtectedRouteDefault } from './ProtectedRoute';
export { default as AuthLayoutDefault } from './AuthLayout';

// Type exports (interfaces are internal to components)
// Components use their own internal interface definitions

// Additional auth-related exports
export { useAuth, initializeAuth } from '../../stores/authStore';
export type { 
  AuthState, 
  AuthActions, 
  AuthStore,
  SignInForm,
  SignUpForm,
  UserProfile,
  UserPreferences
} from '../../types/user'; 
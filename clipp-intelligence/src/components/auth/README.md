# ClippIntell Authentication Components

A complete set of authentication components built with Mantine UI for the ClippIntell application. These components provide a secure, user-friendly authentication experience with dark theme styling and comprehensive form validation.

## Components Overview

### 1. `LoginForm` 
A comprehensive login form with email/password authentication.

**Features:**
- Email and password validation
- Loading states during authentication  
- Remember me checkbox
- Forgot password link
- Sign up redirect link
- Dark theme styling
- Error handling with notifications

**Usage:**
```tsx
import { LoginForm } from '../components/auth';

<LoginForm
  onSignUp={() => setIsSignUp(true)}
  onForgotPassword={() => handleForgotPassword()}
  redirectTo="/dashboard"
/>
```

### 2. `SignupForm`
A feature-rich signup form with password strength checking and validation.

**Features:**
- Email, password, and name validation
- Real-time password strength indicator
- Password confirmation validation
- Terms of service checkbox
- Marketing consent option
- Visual password requirements
- Success state handling
- Dark theme styling

**Usage:**
```tsx
import { SignupForm } from '../components/auth';

<SignupForm
  onSignIn={() => setIsSignUp(false)}
  redirectTo="/dashboard"
/>
```

### 3. `ProtectedRoute`
A route protection wrapper that checks authentication and authorization.

**Features:**
- Authentication checking
- Role-based access control
- Subscription-based access control
- Loading states while checking auth
- Automatic redirect to login
- Custom fallback components
- Comprehensive error states

**Usage:**
```tsx
import { ProtectedRoute } from '../components/auth';

// Basic protection
<ProtectedRoute redirectTo="/login">
  <DashboardComponent />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requireRole="admin" redirectTo="/login">
  <AdminPanel />
</ProtectedRoute>

// Subscription-based protection
<ProtectedRoute requireSubscription="premium" redirectTo="/login">
  <PremiumFeatures />
</ProtectedRoute>
```

### 4. `AuthLayout`
A responsive layout component for authentication pages with branding.

**Features:**
- Responsive design (mobile/desktop)
- Company branding and logo
- Feature highlights
- Social proof statistics
- Footer links
- Gradient background
- Centered form layout

**Usage:**
```tsx
import { AuthLayout } from '../components/auth';

<AuthLayout
  title="ClippIntell"
  subtitle="Intelligent Opportunity Discovery"
  showFeatures={true}
>
  <LoginForm />
</AuthLayout>
```

## Authentication Store Integration

All components integrate seamlessly with the Zustand authentication store:

```tsx
import { useAuth } from '../components/auth';

const { 
  user, 
  profile, 
  signIn, 
  signUp, 
  signOut, 
  loading, 
  error,
  isAuthenticated 
} = useAuth();
```

## Form Validation

### Login Form Validation:
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters

### Signup Form Validation:
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, valid email format with TLD
- **Password**: Required, minimum 8 characters with:
  - At least one lowercase letter
  - At least one uppercase letter  
  - At least one number
  - Special characters recommended
- **Confirm Password**: Must match password
- **Terms**: Must be accepted

## Password Strength Indicator

The signup form includes a real-time password strength indicator:

- **Weak** (0-40%): Red indicator
- **Fair** (40-70%): Yellow indicator  
- **Good** (70-90%): Orange indicator
- **Strong** (90-100%): Green indicator

Visual requirements checklist shows:
- ✅ At least 8 characters
- ✅ Includes number
- ✅ Includes lowercase letter
- ✅ Includes uppercase letter
- ✅ Includes special symbol

## Role-Based Access Control

The `ProtectedRoute` component supports hierarchical role checking:

```tsx
// Role hierarchy (higher numbers have more access)
const roleHierarchy = {
  'user': 0,
  'premium': 1, 
  'admin': 2,
  'enterprise': 3,
};
```

## Subscription-Based Access Control

Subscription levels are also hierarchical:

```tsx
const subscriptionHierarchy = {
  'free': 0,
  'trial': 1,
  'premium': 2, 
  'enterprise': 3,
};
```

## Error Handling

All forms include comprehensive error handling:

- **Network errors**: Displayed via notifications
- **Validation errors**: Shown inline with form fields
- **Authentication errors**: Alert components with dismiss
- **Loading states**: Overlay spinners during requests

## Styling & Theming

Components use Mantine's dark theme with custom styling:

- **Dark color scheme**: Uses CSS custom properties
- **Blue accent color**: Primary action color
- **Consistent spacing**: Mantine's spacing system
- **Responsive design**: Mobile-first approach
- **Custom gradients**: Background and accent elements

## Notifications

Uses Mantine notifications for user feedback:

```tsx
// Success notification
notifications.show({
  title: 'Welcome back!',
  message: 'You have been successfully logged in.',
  color: 'green',
  icon: <IconLogin size={16} />,
});

// Error notification  
notifications.show({
  title: 'Login Failed',
  message: 'Invalid email or password',
  color: 'red',
  icon: <IconAlertCircle size={16} />,
});
```

## Usage Examples

### Complete Login Page:
```tsx
import React, { useState } from 'react';
import { AuthLayout, LoginForm, SignupForm } from '../components/auth';

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <AuthLayout>
      {isSignUp ? (
        <SignupForm onSignIn={() => setIsSignUp(false)} />
      ) : (
        <LoginForm onSignUp={() => setIsSignUp(true)} />
      )}
    </AuthLayout>
  );
};
```

### Protected Dashboard:
```tsx
import React from 'react';
import { ProtectedRoute, useAuth } from '../components/auth';

export const DashboardPage: React.FC = () => {
  return (
    <ProtectedRoute redirectTo="/login">
      <DashboardContent />
    </ProtectedRoute>
  );
};
```

### Conditional Rendering Hook:
```tsx
import { useProtectedRoute } from '../components/auth';

const MyComponent: React.FC = () => {
  const { hasAccess, userRole } = useProtectedRoute('premium');
  
  return (
    <div>
      {hasAccess ? (
        <PremiumContent />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  );
};
```

## Dependencies

Required dependencies:
- `@mantine/core`: UI components
- `@mantine/form`: Form handling
- `@mantine/notifications`: Notification system
- `@tabler/icons-react`: Icons
- `zustand`: State management
- `@supabase/supabase-js`: Authentication backend

## Environment Setup

Ensure these environment variables are set:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Support

All components are fully typed with TypeScript interfaces:
- Form validation types
- User profile types  
- Authentication state types
- Component prop types

This provides excellent developer experience with autocomplete and type safety throughout the authentication flow. 
import React, { useEffect } from 'react';
import { Loader, Center, Stack, Text, Container } from '@mantine/core';
import { IconShield, IconLock } from '@tabler/icons-react';
import { useAuth } from '../../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  requireRole?: 'user' | 'admin' | 'premium' | 'enterprise';
  requireSubscription?: 'free' | 'trial' | 'premium' | 'enterprise';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  fallback,
  requireRole,
  requireSubscription,
}) => {
  const { 
    user, 
    profile, 
    session, 
    loading, 
    isAuthenticated, 
    isInitialized,
    checkAuthStatus 
  } = useAuth();

  useEffect(() => {
    // Check auth status if not initialized
    if (!isInitialized) {
      checkAuthStatus();
    }
  }, [isInitialized, checkAuthStatus]);

  // Show loading spinner while authentication is being checked
  if (!isInitialized || loading) {
    return fallback || (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '60vh' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="blue" type="oval" />
            <Text c="dimmed" size="lg">
              Checking authentication...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user || !session) {
    // Redirect to login page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const loginUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }
    
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: '60vh' }}>
          <Stack align="center" gap="md">
            <IconLock size={48} color="var(--mantine-color-red-5)" />
            <Text c="red" size="lg" fw={500}>
              Access Denied
            </Text>
            <Text c="dimmed" ta="center">
              You need to be logged in to access this page.
              <br />
              Redirecting to login...
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Check role requirements
  if (requireRole && profile?.role !== requireRole) {
    // Check if user has sufficient role level
    const roleHierarchy = {
      'user': 0,
      'premium': 1,
      'admin': 2,
      'enterprise': 3,
    };

    const userRoleLevel = roleHierarchy[profile?.role || 'user'];
    const requiredRoleLevel = roleHierarchy[requireRole];

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <Container size="sm" py="xl">
          <Center style={{ minHeight: '60vh' }}>
            <Stack align="center" gap="md">
              <IconShield size={48} color="var(--mantine-color-yellow-5)" />
              <Text c="yellow" size="lg" fw={500}>
                Insufficient Permissions
              </Text>
              <Text c="dimmed" ta="center">
                You need {requireRole} access to view this page.
                <br />
                Your current role: {profile?.role || 'user'}
              </Text>
            </Stack>
          </Center>
        </Container>
      );
    }
  }

  // Check subscription requirements
  if (requireSubscription && profile?.subscription_status !== requireSubscription) {
    const subscriptionHierarchy = {
      'free': 0,
      'trial': 1,
      'premium': 2,
      'enterprise': 3,
    };

    const userSubscriptionLevel = subscriptionHierarchy[profile?.subscription_status || 'free'];
    const requiredSubscriptionLevel = subscriptionHierarchy[requireSubscription];

    if (userSubscriptionLevel < requiredSubscriptionLevel) {
      return (
        <Container size="sm" py="xl">
          <Center style={{ minHeight: '60vh' }}>
            <Stack align="center" gap="md">
              <IconShield size={48} color="var(--mantine-color-orange-5)" />
              <Text c="orange" size="lg" fw={500}>
                Subscription Required
              </Text>
              <Text c="dimmed" ta="center">
                You need a {requireSubscription} subscription to access this feature.
                <br />
                Your current plan: {profile?.subscription_status || 'free'}
              </Text>
            </Stack>
          </Center>
        </Container>
      );
    }
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

// Hook for conditional rendering based on auth status
export const useProtectedRoute = (
  requireRole?: 'user' | 'admin' | 'premium' | 'enterprise',
  requireSubscription?: 'free' | 'trial' | 'premium' | 'enterprise'
) => {
  const { user, profile, isAuthenticated, isInitialized } = useAuth();

  const hasAccess = React.useMemo(() => {
    if (!isInitialized || !isAuthenticated || !user) {
      return false;
    }

    // Check role requirements
    if (requireRole && profile?.role !== requireRole) {
      const roleHierarchy = {
        'user': 0,
        'premium': 1,
        'admin': 2,
        'enterprise': 3,
      };

      const userRoleLevel = roleHierarchy[profile?.role || 'user'];
      const requiredRoleLevel = roleHierarchy[requireRole];

      if (userRoleLevel < requiredRoleLevel) {
        return false;
      }
    }

    // Check subscription requirements
    if (requireSubscription && profile?.subscription_status !== requireSubscription) {
      const subscriptionHierarchy = {
        'free': 0,
        'trial': 1,
        'premium': 2,
        'enterprise': 3,
      };

      const userSubscriptionLevel = subscriptionHierarchy[profile?.subscription_status || 'free'];
      const requiredSubscriptionLevel = subscriptionHierarchy[requireSubscription];

      if (userSubscriptionLevel < requiredSubscriptionLevel) {
        return false;
      }
    }

    return true;
  }, [isInitialized, isAuthenticated, user, profile, requireRole, requireSubscription]);

  return {
    hasAccess,
    isAuthenticated,
    isInitialized,
    user,
    profile,
    userRole: profile?.role || 'user',
    subscriptionStatus: profile?.subscription_status || 'free',
  };
};

export default ProtectedRoute; 
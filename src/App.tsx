
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/auth';
import { AppShell } from './components/layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CriteriaPage from './pages/CriteriaPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { addMockNotifications } from './stores/layoutStore';
import { useEffect } from 'react';

function App() {
  const { user, loading } = useAuthStore();
  const isAuthenticated = !!user;

  // Add mock notifications for development
  useEffect(() => {
    if (isAuthenticated) {
      addMockNotifications();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Protected App Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/criteria" 
          element={
            <ProtectedRoute>
              <CriteriaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/criteria/manage" 
          element={
            <ProtectedRoute>
              <CriteriaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/criteria/templates" 
          element={
            <ProtectedRoute>
              <CriteriaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;

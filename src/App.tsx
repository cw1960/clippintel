import { Routes, Route, Navigate } from "react-router-dom";
import {
  AppShell,
  Title,
  Text,
  Container,
  Center,
  Stack,
  Button,
} from "@mantine/core";
import { useAuthStore } from "./stores/authStore";
import { ProtectedRoute } from "./components/auth";
import LoginPage from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import CriteriaPage from "./pages/CriteriaPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { addMockNotifications } from "./stores/layoutStore";
import { useEffect } from "react";
import React from "react";

// --- ErrorBoundary Implementation ---
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // Log error to service or console
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Center style={{ minHeight: "60vh" }}>
            <Stack align="center" gap="md">
              <Title order={2} c="red">
                Unexpected Error
              </Title>
              <Text c="dimmed" size="lg">
                Something went wrong. Please reload the page or contact support.
              </Text>
              <Button onClick={() => window.location.reload()} color="red">
                Reload
              </Button>
            </Stack>
          </Center>
        </Container>
      );
    }
    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: true },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Container h={60} style={{ display: "flex", alignItems: "center" }}>
            <Title order={2} c="blue">
              Clipp Intelligence
            </Title>
          </Container>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Text>Navigation will go here</Text>
        </AppShell.Navbar>

        <AppShell.Main>
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
        </AppShell.Main>
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;

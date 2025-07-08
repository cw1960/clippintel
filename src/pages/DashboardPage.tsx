import React, { useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Grid,
  Group,
  Button,
  Badge,
  Progress,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconDashboard,
  IconTargetArrow,
  IconBell,
  IconTrendingUp,
  IconCalendarEvent,
  IconLogout,
} from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";
import { useAuth } from "../components/auth";
import { clearAllZustandStores } from "../utils/formatting";

export const DashboardPage: React.FC = () => {
  // Defensive: fallback to no-op if store is undefined
  const { activeItem, setActiveItem } = useActiveNavItem
    ? useActiveNavItem()
    : { activeItem: null, setActiveItem: () => {} };
  const { profile, isLoading, isInitialized, error, signOut } = useAuth
    ? useAuth()
    : {
        profile: null,
        isLoading: false,
        isInitialized: false,
        error: null,
        signOut: async () => {},
      };

  // Only set active nav item on mount, never on every render
  useEffect(() => {
    if (activeItem !== "dashboard") setActiveItem("dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    clearAllZustandStores();
    if (signOut) await signOut();
    window.location.href = "/login";
  };

  // Robust guards for loading, error, and null/malformed profile
  if (!isInitialized || isLoading) {
    return (
      <Center style={{ minHeight: "60vh" }}>
        <Loader size="lg" color="blue" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: "60vh" }}>
          <Stack align="center" gap="md">
            <Title order={2} c="red">
              Error
            </Title>
            <Text c="dimmed" size="lg">
              {typeof error === "string"
                ? error
                : "Failed to load profile. Please try again or contact support."}
            </Text>
            <Button onClick={handleLogout} color="red">
              Go to Login
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (!profile || !profile.id || !profile.email) {
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: "60vh" }}>
          <Stack align="center" gap="md">
            <Title order={2} c="red">
              Profile Not Found
            </Title>
            <Text c="dimmed" size="lg">
              Your profile could not be loaded or is incomplete. Please sign out
              and try again, or contact support if the issue persists.
            </Text>
            <Button onClick={handleLogout} color="red">
              Go to Login
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Fallbacks for profile fields
  const displayName = profile.full_name || profile.email || "User";

  // Try/catch for all rendering logic
  try {
    return (
      <Container size="xl">
        <Stack gap="xl">
          {/* Page Header */}
          <Stack gap="xs">
            <Group gap="sm" justify="space-between">
              <Group gap="sm">
                <IconDashboard size={32} color="var(--mantine-color-blue-6)" />
                <Title order={1}>Dashboard</Title>
              </Group>
              <Button
                variant="light"
                color="red"
                leftSection={<IconLogout size={16} />}
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </Group>
            <Text c="dimmed" size="lg">
              Welcome, {displayName}! Monitor opportunities and track your
              success.
            </Text>
          </Stack>

          {/* Key Metrics */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper
                p="md"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>
                      Active Opportunities
                    </Text>
                    <IconTargetArrow
                      size={16}
                      color="var(--mantine-color-blue-6)"
                    />
                  </Group>
                  <Text size="xl" fw={700} c="blue">
                    24
                  </Text>
                  <Text size="xs" c="green">
                    12% from last week
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper
                p="md"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>
                      Match Score
                    </Text>
                    <IconTrendingUp
                      size={16}
                      color="var(--mantine-color-green-6)"
                    />
                  </Group>
                  <Text size="xl" fw={700} c="green">
                    87%
                  </Text>
                  <Text size="xs" c="green">
                    15% improvement
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper
                p="md"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>
                      Applications
                    </Text>
                    <IconCalendarEvent
                      size={16}
                      color="var(--mantine-color-orange-6)"
                    />
                  </Group>
                  <Text size="xl" fw={700} c="orange">
                    8
                  </Text>
                  <Text size="xs" c="orange">
                    3 pending review
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper
                p="md"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>
                      Success Rate
                    </Text>
                    <IconBell size={16} color="var(--mantine-color-purple-6)" />
                  </Group>
                  <Text size="xl" fw={700} c="purple">
                    72%
                  </Text>
                  <Text size="xs" c="purple">
                    Above average
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          <Grid>
            {/* Recent Opportunities */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Paper
                p="xl"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="md">
                  <Group justify="space-between">
                    <Title order={3}>Recent Opportunities</Title>
                    <Button variant="subtle" size="sm">
                      View All
                    </Button>
                  </Group>
                  <Stack gap="md">
                    {[
                      {
                        title: "AI Research Innovation Grant",
                        value: "$150,000",
                        match: 95,
                        deadline: "15 days",
                        status: "new",
                      },
                      {
                        title: "Small Business Technology Fund",
                        value: "$75,000",
                        match: 88,
                        deadline: "8 days",
                        status: "reviewing",
                      },
                      {
                        title: "Digital Transformation Initiative",
                        value: "$200,000",
                        match: 82,
                        deadline: "22 days",
                        status: "new",
                      },
                      {
                        title: "Sustainability Research Program",
                        value: "$100,000",
                        match: 79,
                        deadline: "5 days",
                        status: "applied",
                      },
                    ].map((opportunity, index) => (
                      <Paper
                        key={index}
                        p="md"
                        radius="sm"
                        style={{
                          border:
                            "1px solid var(--mantine-color-default-border)",
                          backgroundColor: "var(--mantine-color-gray-light)",
                        }}
                      >
                        <Group justify="space-between" align="flex-start">
                          <Stack gap="xs" style={{ flex: 1 }}>
                            <Group gap="sm">
                              <Text fw={500} size="sm">
                                {opportunity.title}
                              </Text>
                              <Badge
                                color={
                                  opportunity.status === "new"
                                    ? "blue"
                                    : opportunity.status === "applied"
                                      ? "green"
                                      : "orange"
                                }
                                variant="light"
                                size="xs"
                              >
                                {opportunity.status}
                              </Badge>
                            </Group>
                            <Group gap="lg">
                              <Text size="xs" c="dimmed">
                                Value: {opportunity.value}
                              </Text>
                              <Text size="xs" c="dimmed">
                                Deadline: {opportunity.deadline}
                              </Text>
                            </Group>
                            <Group gap="sm" align="center">
                              <Text size="xs" c="dimmed">
                                Match:
                              </Text>
                              <Progress
                                value={opportunity.match}
                                size="sm"
                                style={{ flex: 1, maxWidth: 100 }}
                                color={
                                  opportunity.match > 90
                                    ? "green"
                                    : opportunity.match > 80
                                      ? "blue"
                                      : "orange"
                                }
                              />
                              <Text
                                size="xs"
                                fw={500}
                                c={
                                  opportunity.match > 90
                                    ? "green"
                                    : opportunity.match > 80
                                      ? "blue"
                                      : "orange"
                                }
                              >
                                {opportunity.match}%
                              </Text>
                            </Group>
                          </Stack>
                          <Button size="xs" variant="light">
                            View
                          </Button>
                        </Group>
                      </Paper>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>

            {/* Quick Actions */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Paper
                p="xl"
                radius="md"
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                }}
              >
                <Stack gap="md">
                  <Title order={3}>Quick Actions</Title>
                  <Stack gap="sm">
                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconTargetArrow size={16} />}
                    >
                      Create New Criteria
                    </Button>
                    <Button
                      fullWidth
                      variant="light"
                      leftSection={<IconBell size={16} />}
                    >
                      Review Notifications
                    </Button>
                    <Button fullWidth variant="outline">
                      Export Report
                    </Button>
                    <Button fullWidth variant="outline">
                      Schedule Meeting
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    );
  } catch (err) {
    // Log the error for debugging
    // eslint-disable-next-line no-console
    console.error("DashboardPage render error:", err);
    return (
      <Container size="sm" py="xl">
        <Center style={{ minHeight: "60vh" }}>
          <Stack align="center" gap="md">
            <Title order={2} c="red">
              Dashboard Error
            </Title>
            <Text c="dimmed" size="lg">
              {err instanceof Error ? err.message : String(err)}
            </Text>
            <Button onClick={handleLogout} color="red">
              Go to Login
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }
};

export default DashboardPage;

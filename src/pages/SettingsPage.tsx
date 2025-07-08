import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Group,
  Button,
  Switch,
  Divider,
  Tabs,
  TextInput,
  Select,
  PasswordInput,
  Textarea,
  Loader,
  Center,
} from "@mantine/core";
import {
  IconSettings,
  IconUser,
  IconBell,
  IconShield,
  IconPalette,
} from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";
import { useEffect } from "react";
import { useAuth } from "../components/auth";

export const SettingsPage: React.FC = () => {
  const { activeItem, setActiveItem } = useActiveNavItem();
  const { profile, isLoading, isInitialized, error } = useAuth
    ? useAuth()
    : { profile: null, isLoading: false, isInitialized: false, error: null };

  useEffect(() => {
    if (activeItem !== "settings") setActiveItem("settings");
  }, [activeItem, setActiveItem]);

  // Bulletproof guards for loading, error, and null/malformed profile
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
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Page Header */}
        <Stack gap="xs">
          <Group gap="sm">
            <IconSettings size={32} color="var(--mantine-color-blue-6)" />
            <Title order={1}>Settings</Title>
          </Group>
          <Text c="dimmed" size="lg">
            Manage your account preferences and application settings
          </Text>
        </Stack>

        <Tabs defaultValue="profile" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="notifications"
              leftSection={<IconBell size={16} />}
            >
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
              Security
            </Tabs.Tab>
            <Tabs.Tab
              value="appearance"
              leftSection={<IconPalette size={16} />}
            >
              Appearance
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="md">
            <Paper
              p="xl"
              radius="md"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Stack gap="md">
                <Title order={3}>Profile Information</Title>
                <Divider />
                <Group grow>
                  <TextInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    defaultValue="John Doe"
                  />
                  <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    defaultValue="john.doe@example.com"
                    disabled
                  />
                </Group>
                <Group grow>
                  <TextInput
                    label="Company"
                    placeholder="Enter your company"
                    defaultValue="Acme Corp"
                  />
                  <TextInput
                    label="Job Title"
                    placeholder="Enter your job title"
                    defaultValue="Research Director"
                  />
                </Group>
                <Textarea
                  label="Bio"
                  placeholder="Tell us about yourself"
                  rows={3}
                  defaultValue="Experienced researcher with focus on AI and machine learning applications in business."
                />
                <Group justify="flex-end">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="notifications" pt="md">
            <Paper
              p="xl"
              radius="md"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Stack gap="md">
                <Title order={3}>Notification Preferences</Title>
                <Divider />
                <Stack gap="lg">
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Email Notifications</Text>
                      <Text size="sm" c="dimmed">
                        Receive notifications via email
                      </Text>
                    </Stack>
                    <Switch defaultChecked />
                  </Group>
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Desktop Notifications</Text>
                      <Text size="sm" c="dimmed">
                        Show browser notifications
                      </Text>
                    </Stack>
                    <Switch />
                  </Group>
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Opportunity Alerts</Text>
                      <Text size="sm" c="dimmed">
                        Get notified of new matching opportunities
                      </Text>
                    </Stack>
                    <Switch defaultChecked />
                  </Group>
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Weekly Digest</Text>
                      <Text size="sm" c="dimmed">
                        Receive weekly summary reports
                      </Text>
                    </Stack>
                    <Switch defaultChecked />
                  </Group>
                  <Select
                    label="Email Frequency"
                    placeholder="Select frequency"
                    data={[
                      { value: "immediate", label: "Immediate" },
                      { value: "daily", label: "Daily Digest" },
                      { value: "weekly", label: "Weekly Digest" },
                    ]}
                    defaultValue="daily"
                  />
                </Stack>
                <Group justify="flex-end">
                  <Button>Save Preferences</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="security" pt="md">
            <Paper
              p="xl"
              radius="md"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Stack gap="md">
                <Title order={3}>Security Settings</Title>
                <Divider />
                <Stack gap="lg">
                  <Group grow>
                    <PasswordInput
                      label="Current Password"
                      placeholder="Enter current password"
                    />
                  </Group>
                  <Group grow>
                    <PasswordInput
                      label="New Password"
                      placeholder="Enter new password"
                    />
                    <PasswordInput
                      label="Confirm Password"
                      placeholder="Confirm new password"
                    />
                  </Group>
                  <Divider />
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Two-Factor Authentication</Text>
                      <Text size="sm" c="dimmed">
                        Add an extra layer of security to your account
                      </Text>
                    </Stack>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </Group>
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Login Sessions</Text>
                      <Text size="sm" c="dimmed">
                        Manage your active login sessions
                      </Text>
                    </Stack>
                    <Button variant="outline" size="sm">
                      View Sessions
                    </Button>
                  </Group>
                </Stack>
                <Group justify="flex-end">
                  <Button>Update Password</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>

          <Tabs.Panel value="appearance" pt="md">
            <Paper
              p="xl"
              radius="md"
              style={{
                border: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Stack gap="md">
                <Title order={3}>Appearance Settings</Title>
                <Divider />
                <Stack gap="lg">
                  <Select
                    label="Theme"
                    placeholder="Select theme"
                    data={[
                      { value: "auto", label: "Auto (System)" },
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                    ]}
                    defaultValue="dark"
                  />
                  <Select
                    label="Language"
                    placeholder="Select language"
                    data={[
                      { value: "en", label: "English" },
                      { value: "es", label: "Español" },
                      { value: "fr", label: "Français" },
                    ]}
                    defaultValue="en"
                  />
                  <Select
                    label="Date Format"
                    placeholder="Select date format"
                    data={[
                      { value: "mm/dd/yyyy", label: "MM/DD/YYYY" },
                      { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
                      { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
                    ]}
                    defaultValue="mm/dd/yyyy"
                  />
                  <Group justify="space-between">
                    <Stack gap={0}>
                      <Text fw={500}>Compact Mode</Text>
                      <Text size="sm" c="dimmed">
                        Show more information in less space
                      </Text>
                    </Stack>
                    <Switch />
                  </Group>
                </Stack>
                <Group justify="flex-end">
                  <Button>Save Preferences</Button>
                </Group>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default SettingsPage;

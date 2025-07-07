import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Group,
  Button,
  Badge,
  Switch,
  Divider,
  Tabs,
} from "@mantine/core";
import { IconBell, IconSettings, IconCheck, IconX } from "@tabler/icons-react";
import { useActiveNavItem } from "../stores/layoutStore";
import { useEffect } from "react";

export const NotificationsPage: React.FC = () => {
  const { setActiveItem } = useActiveNavItem();

  useEffect(() => {
    setActiveItem("notifications");
  }, [setActiveItem]);

  return (
    <Container size="xl">
      <Stack gap="xl">
        {/* Page Header */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Group gap="sm">
              <IconBell size={32} color="var(--mantine-color-blue-6)" />
              <Title order={1}>Notifications</Title>
            </Group>
            <Text c="dimmed" size="lg">
              Stay updated on opportunities and system alerts
            </Text>
          </Stack>
          <Button leftSection={<IconSettings size={18} />} variant="outline">
            Settings
          </Button>
        </Group>

        <Tabs defaultValue="all" variant="outline">
          <Tabs.List>
            <Tabs.Tab value="all">All Notifications</Tabs.Tab>
            <Tabs.Tab value="unread">Unread (3)</Tabs.Tab>
            <Tabs.Tab value="opportunities">Opportunities</Tabs.Tab>
            <Tabs.Tab value="system">System</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="md">
            <Stack gap="md">
              {[
                {
                  title: "New Opportunity Found",
                  message:
                    "AI Research Grant matching your criteria has been discovered",
                  time: "5 minutes ago",
                  read: false,
                  type: "opportunity",
                },
                {
                  title: "Deadline Reminder",
                  message: "Grant application due in 3 days",
                  time: "30 minutes ago",
                  read: false,
                  type: "reminder",
                },
                {
                  title: "Profile Updated",
                  message: "Your profile has been successfully updated",
                  time: "2 hours ago",
                  read: true,
                  type: "system",
                },
                {
                  title: "Weekly Report Ready",
                  message: "Your weekly opportunity report is ready for review",
                  time: "1 day ago",
                  read: true,
                  type: "report",
                },
              ].map((notification, index) => (
                <Paper
                  key={index}
                  p="md"
                  radius="md"
                  style={{
                    border: "1px solid var(--mantine-color-default-border)",
                    backgroundColor: notification.read
                      ? "transparent"
                      : "var(--mantine-color-blue-light)",
                  }}
                >
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Group gap="sm">
                        <Text fw={500} size="sm">
                          {notification.title}
                        </Text>
                        {!notification.read && (
                          <Badge size="xs" color="blue" variant="filled">
                            New
                          </Badge>
                        )}
                      </Group>
                      <Text c="dimmed" size="sm">
                        {notification.message}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {notification.time}
                      </Text>
                    </Stack>
                    <Group gap="xs">
                      {!notification.read && (
                        <Button size="xs" variant="subtle">
                          <IconCheck size={14} />
                        </Button>
                      )}
                      <Button size="xs" variant="subtle" color="red">
                        <IconX size={14} />
                      </Button>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="unread" pt="md">
            <Text c="dimmed">Unread notifications will appear here...</Text>
          </Tabs.Panel>

          <Tabs.Panel value="opportunities" pt="md">
            <Text c="dimmed">
              Opportunity notifications will appear here...
            </Text>
          </Tabs.Panel>

          <Tabs.Panel value="system" pt="md">
            <Text c="dimmed">System notifications will appear here...</Text>
          </Tabs.Panel>
        </Tabs>

        {/* Notification Settings */}
        <Paper
          p="xl"
          radius="md"
          style={{ border: "1px solid var(--mantine-color-default-border)" }}
        >
          <Stack gap="md">
            <Title order={3}>Notification Settings</Title>
            <Divider />
            <Stack gap="md">
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
                  <Text fw={500}>New Opportunities</Text>
                  <Text size="sm" c="dimmed">
                    Get notified when new matching opportunities are found
                  </Text>
                </Stack>
                <Switch defaultChecked />
              </Group>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={500}>Deadline Reminders</Text>
                  <Text size="sm" c="dimmed">
                    Receive reminders for upcoming deadlines
                  </Text>
                </Stack>
                <Switch defaultChecked />
              </Group>
              <Group justify="space-between">
                <Stack gap={0}>
                  <Text fw={500}>Weekly Reports</Text>
                  <Text size="sm" c="dimmed">
                    Get weekly summary reports
                  </Text>
                </Stack>
                <Switch />
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default NotificationsPage;

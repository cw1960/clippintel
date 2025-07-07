import {
  Group,
  Text,
  UnstyledButton,
  Avatar,
  Menu,
  Indicator,
  ActionIcon,
  useMantineColorScheme,
  Box,
  ScrollArea,
  Divider,
  Button,
  Drawer,
  Stack,
  Center,
  Tooltip,
  useMatches,
} from "@mantine/core";
import {
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconSun,
  IconMoonStars,
  IconCheck,
  IconX,
  IconExternalLink,
} from "@tabler/icons-react";
import { useAuthStore } from "../../stores/authStore";
import {
  useNotificationsState,
  useUserMenuState,
} from "../../stores/layoutStore";
import type { HeaderProps } from "../../types/layout";

export const Header: React.FC<HeaderProps> = ({
  burger,
  showNotifications = true,
  showUserMenu = true,
  showThemeToggle = true,
}) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { user, profile, signOut } = useAuthStore();
  const { opened: userMenuOpened, toggle: toggleUserMenu } = useUserMenuState();
  const {
    opened: notificationsPanelOpened,
    toggle: toggleNotificationsPanel,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotificationsState();

  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNotificationAction = (
    notificationId: string,
    actionPath?: string,
  ) => {
    markAsRead(notificationId);
    if (actionPath) {
      // Navigate to the action path
      window.location.href = actionPath;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <IconCheck size={16} color="green" />;
      case "warning":
        return <IconBell size={16} color="orange" />;
      case "error":
        return <IconX size={16} color="red" />;
      default:
        return <IconBell size={16} color="blue" />;
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* Left side - Burger menu and title */}
      <Group gap="md">
        {burger}
        <Group gap="xs">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #F5422E 0%, #36A4A0 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="https://i.imgur.com/Bg1YnEg.png"
              alt="Clipp Intelligence Logo"
              style={{ width: 32, height: 32, objectFit: "contain" }}
            />
          </Box>
          {!isMobile && (
            <Box>
              <Text size="lg" fw={700} c="var(--mantine-color-text)">
                Clipp Intelligence
              </Text>
              <Text size="xs" c="dimmed" fw={500}>
                Intelligent Opportunity Discovery for Whop Content Clippers
              </Text>
            </Box>
          )}
        </Group>
      </Group>

      {/* Right side - Actions */}
      <Group gap="xs">
        {/* Theme toggle */}
        {showThemeToggle && (
          <Tooltip
            label={`Switch to ${colorScheme === "dark" ? "light" : "dark"} theme`}
          >
            <ActionIcon
              onClick={() => toggleColorScheme()}
              variant="default"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === "dark" ? (
                <IconSun size={18} />
              ) : (
                <IconMoonStars size={18} />
              )}
            </ActionIcon>
          </Tooltip>
        )}

        {/* Notifications */}
        {showNotifications && (
          <>
            <Tooltip label="Notifications">
              <Indicator
                inline
                label={unreadCount > 0 ? unreadCount : undefined}
                size={16}
                disabled={unreadCount === 0}
              >
                <ActionIcon
                  onClick={toggleNotificationsPanel}
                  variant="default"
                  size="lg"
                  aria-label="Toggle notifications"
                >
                  <IconBell size={18} />
                </ActionIcon>
              </Indicator>
            </Tooltip>

            {/* Notifications Drawer */}
            <Drawer
              opened={notificationsPanelOpened}
              onClose={toggleNotificationsPanel}
              position="right"
              size="md"
              title="Notifications"
              overlayProps={{ opacity: 0.5, blur: 4 }}
            >
              <Stack gap="md">
                {/* Header actions */}
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up!"}
                  </Text>
                  {unreadCount > 0 && (
                    <Button variant="subtle" size="xs" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </Group>

                <Divider />

                {/* Notifications list */}
                <ScrollArea style={{ height: "calc(100vh - 200px)" }}>
                  {notifications.length === 0 ? (
                    <Center py="xl">
                      <Stack align="center" gap="md">
                        <IconBell
                          size={48}
                          color="var(--mantine-color-dimmed)"
                        />
                        <Text c="dimmed" ta="center">
                          No notifications yet
                        </Text>
                      </Stack>
                    </Center>
                  ) : (
                    <Stack gap="xs">
                      {notifications.map((notification) => (
                        <Box
                          key={notification.id}
                          style={{
                            padding: "var(--mantine-spacing-sm)",
                            borderRadius: "var(--mantine-radius-sm)",
                            backgroundColor: notification.read
                              ? "transparent"
                              : "var(--mantine-color-blue-light)",
                            border: `1px solid ${
                              notification.read
                                ? "var(--mantine-color-default-border)"
                                : "var(--mantine-color-blue-outline)"
                            }`,
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleNotificationAction(
                              notification.id,
                              notification.action?.path,
                            )
                          }
                        >
                          <Group justify="space-between" align="flex-start">
                            <Group
                              align="flex-start"
                              gap="sm"
                              style={{ flex: 1 }}
                            >
                              {getNotificationIcon(notification.type)}
                              <Stack gap={4} style={{ flex: 1 }}>
                                <Text size="sm" fw={500}>
                                  {notification.title}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {notification.message}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  {formatNotificationTime(
                                    notification.timestamp,
                                  )}
                                </Text>
                                {notification.action && (
                                  <Group gap="xs">
                                    <Button
                                      size="xs"
                                      variant="subtle"
                                      rightSection={
                                        <IconExternalLink size={12} />
                                      }
                                    >
                                      {notification.action.label}
                                    </Button>
                                  </Group>
                                )}
                              </Stack>
                            </Group>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                            >
                              <IconX size={12} />
                            </ActionIcon>
                          </Group>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </ScrollArea>
              </Stack>
            </Drawer>
          </>
        )}

        {/* User Menu */}
        {showUserMenu && user && (
          <Menu
            shadow="lg"
            width={260}
            position="bottom-end"
            offset={5}
            opened={userMenuOpened}
            onChange={toggleUserMenu}
          >
            <Menu.Target>
              <UnstyledButton>
                <Group gap="sm">
                  <Avatar
                    src={profile?.avatar_url}
                    size="sm"
                    radius="xl"
                    color="blue"
                  >
                    <IconUser size={16} />
                  </Avatar>
                  {!isMobile && (
                    <Stack gap={0}>
                      <Text size="sm" fw={500}>
                        {profile?.full_name || user.email?.split("@")[0]}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Free
                      </Text>
                    </Stack>
                  )}
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Group gap="sm">
                  <Avatar
                    src={profile?.avatar_url}
                    size="sm"
                    radius="xl"
                    color="blue"
                  >
                    <IconUser size={16} />
                  </Avatar>
                  <Stack gap={0}>
                    <Text size="sm" fw={500}>
                      {profile?.full_name || user.email?.split("@")[0]}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  </Stack>
                </Group>
              </Menu.Label>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconUser size={14} />}
                onClick={() => (window.location.href = "/profile")}
              >
                Profile
              </Menu.Item>

              <Menu.Item
                leftSection={<IconSettings size={14} />}
                onClick={() => (window.location.href = "/settings")}
              >
                Settings
              </Menu.Item>

              <Menu.Divider />

              <Menu.Item
                leftSection={<IconLogout size={14} />}
                color="red"
                onClick={handleSignOut}
              >
                Sign out
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Group>
  );
};

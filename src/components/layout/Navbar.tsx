import {
  Stack,
  Group,
  Text,
  UnstyledButton,
  Badge,
  Divider,
  Avatar,
  Box,
  ScrollArea,
  Collapse,
  rem,
  useMatches,
} from '@mantine/core';
import {
  IconDashboard,
  IconTargetArrow,
  IconBell,
  IconSettings,
  IconUser,
  IconChevronDown,
  IconChevronRight,
  IconLogout,
  IconBrain,
  IconFileText,
  IconChartBar,
  IconFilter,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useActiveNavItem } from '../../stores/layoutStore';
import type { NavbarProps, NavItem } from '../../types/layout';

// Navigation items configuration
const navigationItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <IconDashboard size={20} />,
    path: '/dashboard',
  },
  {
    id: 'criteria',
    label: 'Criteria',
    icon: <IconTargetArrow size={20} />,
    path: '/criteria',
    children: [
      {
        id: 'criteria-manage',
        label: 'Manage Criteria',
        icon: <IconFilter size={18} />,
        path: '/criteria/manage',
      },
      {
        id: 'criteria-templates',
        label: 'Templates',
        icon: <IconFileText size={18} />,
        path: '/criteria/templates',
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <IconBell size={20} />,
    path: '/notifications',
    badge: 3,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <IconChartBar size={20} />,
    path: '/analytics',
    requiredRole: 'premium',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <IconSettings size={20} />,
    path: '/settings',
  },
];

interface NavItemButtonProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  hasChildren?: boolean;
  isExpanded?: boolean;
  level?: number;
}

const NavItemButton: React.FC<NavItemButtonProps> = ({
  item,
  active,
  onClick,
  hasChildren = false,
  isExpanded = false,
  level = 0,
}) => {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: `${rem(8)} ${rem(12)}`,
        paddingLeft: level > 0 ? rem(32) : rem(12),
        borderRadius: 'var(--mantine-radius-sm)',
        backgroundColor: active 
          ? 'var(--mantine-color-blue-light)' 
          : 'transparent',
        border: active 
          ? '1px solid var(--mantine-color-blue-outline)' 
          : '1px solid transparent',
        color: active 
          ? 'var(--mantine-color-blue-text)' 
          : 'var(--mantine-color-text)',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      }}
      data-active={active}
      __vars={{
        '--hover-bg': active 
          ? 'var(--mantine-color-blue-light)' 
          : 'var(--mantine-color-gray-light)',
      }}
    >
      <Group justify="space-between" align="center" gap="sm">
        <Group align="center" gap="sm">
          <Box c={active ? 'blue' : 'dimmed'}>
            {item.icon}
          </Box>
          <Text size="sm" fw={active ? 600 : 400}>
            {item.label}
          </Text>
        </Group>
        
        <Group gap="xs">
          {item.badge && (
            <Badge size="xs" variant="filled" color="red">
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            <Box c="dimmed">
              {isExpanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )}
            </Box>
          )}
        </Group>
      </Group>
    </UnstyledButton>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  onClose,
  activeItem,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuthStore();
  const { activeItem: storeActiveItem, setActiveItem } = useActiveNavItem();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isMobile = useMatches({
    base: true,
    sm: false,
  });

  const currentActiveItem = activeItem || storeActiveItem;

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id);
    } else {
      navigate(item.path);
      setActiveItem(item.id);
      onItemClick?.(item);
      if (isMobile) {
        onClose();
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  // Filter items based on user role
  const filterItemsByRole = (items: NavItem[]) => {
    return items.filter(item => {
      if (!item.requiredRole) return true;
      
      // For now, all users have access to all features
      // In the future, you can implement role-based access control
      return true;
    });
  };

  const filteredItems = filterItemsByRole(navigationItems);

  return (
    <Box
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--mantine-color-body)',
        borderRight: '1px solid var(--mantine-color-default-border)',
      }}
    >
      {/* Navigation Header */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
        <Group gap="sm">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-5))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBrain size={20} color="white" />
          </Box>
          <Stack gap={0}>
            <Text size="sm" fw={700}>
              ClippIntell
            </Text>
            <Text size="xs" c="dimmed">
              Opportunity Intelligence
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* Navigation Items */}
      <ScrollArea style={{ flex: 1 }} p="md">
        <Stack gap="xs">
          {filteredItems.map((item) => {
            const isActive = currentActiveItem === item.id || location.pathname === item.path;
            const isExpanded = expandedItems.includes(item.id);
            
            return (
              <Box key={item.id}>
                <NavItemButton
                  item={item}
                  active={isActive}
                  onClick={() => handleItemClick(item)}
                  hasChildren={item.children && item.children.length > 0}
                  isExpanded={isExpanded}
                />
                
                {item.children && (
                  <Collapse in={isExpanded}>
                    <Stack gap="xs" mt="xs">
                      {item.children.map((child) => {
                        const childIsActive = currentActiveItem === child.id || location.pathname === child.path;
                        return (
                          <NavItemButton
                            key={child.id}
                            item={child}
                            active={childIsActive}
                            onClick={() => {
                              navigate(child.path);
                              setActiveItem(child.id);
                              onItemClick?.(child);
                              if (isMobile) {
                                onClose();
                              }
                            }}
                            level={1}
                          />
                        );
                      })}
                    </Stack>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      </ScrollArea>

      {/* User Profile Section */}
      <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        <Stack gap="md">
          <Divider />
          
          {/* User Info */}
          <Group gap="sm">
            <Avatar 
              src={profile?.avatar_url} 
              size="sm" 
              radius="xl"
              color="blue"
            >
              <IconUser size={16} />
            </Avatar>
            <Stack gap={0} style={{ flex: 1 }}>
              <Text size="sm" fw={500} truncate>
                {profile?.full_name || user?.email?.split('@')[0]}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {user?.email}
              </Text>
            </Stack>
          </Group>

          {/* Quick Actions */}
          <Group gap="xs">
            <UnstyledButton
              onClick={() => navigate('/profile')}
              style={{
                flex: 1,
                padding: `${rem(6)} ${rem(8)}`,
                borderRadius: 'var(--mantine-radius-sm)',
                backgroundColor: 'var(--mantine-color-gray-light)',
                border: '1px solid var(--mantine-color-default-border)',
              }}
            >
              <Group gap="xs" justify="center">
                <IconUser size={14} />
                <Text size="xs">Profile</Text>
              </Group>
            </UnstyledButton>
            
            <UnstyledButton
              onClick={handleSignOut}
              style={{
                flex: 1,
                padding: `${rem(6)} ${rem(8)}`,
                borderRadius: 'var(--mantine-radius-sm)',
                backgroundColor: 'var(--mantine-color-red-light)',
                border: '1px solid var(--mantine-color-red-outline)',
                color: 'var(--mantine-color-red-text)',
              }}
            >
              <Group gap="xs" justify="center">
                <IconLogout size={14} />
                <Text size="xs">Sign Out</Text>
              </Group>
            </UnstyledButton>
          </Group>
        </Stack>
      </Box>
    </Box>
  );
}; 
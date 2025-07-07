import type { ReactNode, ComponentType } from "react";

// Navigation menu item interface
export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  badge?: number;
  children?: NavItem[];
  requiredRole?: "user" | "premium" | "admin" | "enterprise";
}

// User menu item interface
export interface UserMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  action: () => void;
  color?: string;
  divider?: boolean;
}

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
  action?: {
    label: string;
    path: string;
  };
}

// Layout state interface
export interface LayoutState {
  navbarOpened: boolean;
  userMenuOpened: boolean;
  notificationsPanelOpened: boolean;
  activeNavItem: string;
  notifications: Notification[];
  unreadNotificationsCount: number;
}

// Layout actions interface
export interface LayoutActions {
  toggleNavbar: () => void;
  closeNavbar: () => void;
  toggleUserMenu: () => void;
  toggleNotificationsPanel: () => void;
  setActiveNavItem: (itemId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (notificationId: string) => void;
}

// Combined layout store interface
export interface LayoutStore extends LayoutState, LayoutActions {}

// Header props interface
export interface HeaderProps {
  burger?: ReactNode;
  title?: string;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  showThemeToggle?: boolean;
}

// Navbar props interface
export interface NavbarProps {
  opened: boolean;
  onClose: () => void;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

// AppShell props interface
export interface AppShellProps {
  children: ReactNode;
  navbar?: {
    width: { base: number; sm: number; lg: number };
    breakpoint: "sm" | "md" | "lg" | "xl";
  };
  header?: {
    height: { base: number; sm: number };
  };
  padding?: string;
}

// Route configuration interface
export interface RouteConfig {
  path: string;
  component: ComponentType;
  protected: boolean;
  requiredRole?: "user" | "premium" | "admin" | "enterprise";
  exact?: boolean;
  title?: string;
  showInNav?: boolean;
  navItem?: Omit<NavItem, "path">;
}

// Mobile breakpoint helpers
export type MobileBreakpoint = "base" | "xs" | "sm" | "md" | "lg" | "xl";

export interface ResponsiveValue<T> {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

// Animation presets
export interface AnimationPresets {
  navbar: {
    transition: string;
    ease: string;
  };
  header: {
    transition: string;
    ease: string;
  };
  dropdown: {
    transition: string;
    ease: string;
  };
}

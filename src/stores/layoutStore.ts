import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LayoutStore, Notification } from '../types/layout';

// Generate unique notification ID
const generateNotificationId = () => `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      // State
      navbarOpened: false,
      userMenuOpened: false,
      notificationsPanelOpened: false,
      activeNavItem: 'dashboard',
      notifications: [],
      unreadNotificationsCount: 0,

      // Actions
      toggleNavbar: () => {
        set((state) => ({ navbarOpened: !state.navbarOpened }));
      },

      closeNavbar: () => {
        set({ navbarOpened: false });
      },

      toggleUserMenu: () => {
        set((state) => ({ userMenuOpened: !state.userMenuOpened }));
      },

      toggleNotificationsPanel: () => {
        set((state) => ({ notificationsPanelOpened: !state.notificationsPanelOpened }));
      },

      setActiveNavItem: (itemId: string) => {
        set({ activeNavItem: itemId });
      },

      markNotificationAsRead: (notificationId: string) => {
        set((state) => {
          const notifications = state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          
          return {
            notifications,
            unreadNotificationsCount: unreadCount,
          };
        });
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
          unreadNotificationsCount: 0,
        }));
      },

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = {
          ...notification,
          id: generateNotificationId(),
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadNotificationsCount: state.unreadNotificationsCount + 1,
        }));
      },

      removeNotification: (notificationId: string) => {
        set((state) => {
          const notifications = state.notifications.filter(
            (notification) => notification.id !== notificationId
          );
          const unreadCount = notifications.filter((n) => !n.read).length;
          
          return {
            notifications,
            unreadNotificationsCount: unreadCount,
          };
        });
      },
    }),
    {
      name: 'layout-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeNavItem: state.activeNavItem,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount,
      }),
    }
  )
);

// Helper hooks
export const useNavbarState = () => useLayoutStore((state) => ({
  opened: state.navbarOpened,
  toggle: state.toggleNavbar,
  close: state.closeNavbar,
}));

export const useUserMenuState = () => useLayoutStore((state) => ({
  opened: state.userMenuOpened,
  toggle: state.toggleUserMenu,
}));

export const useNotificationsState = () => useLayoutStore((state) => ({
  opened: state.notificationsPanelOpened,
  toggle: state.toggleNotificationsPanel,
  notifications: state.notifications,
  unreadCount: state.unreadNotificationsCount,
  markAsRead: state.markNotificationAsRead,
  markAllAsRead: state.markAllNotificationsAsRead,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
}));

export const useActiveNavItem = () => useLayoutStore((state) => ({
  activeItem: state.activeNavItem,
  setActiveItem: state.setActiveNavItem,
}));

// Mock notifications for development
export const addMockNotifications = () => {
  const { addNotification } = useLayoutStore.getState();
  
  const mockNotifications = [
    {
      title: 'New Opportunity Found',
      message: 'AI Research Grant matching your criteria',
      type: 'info' as const,
      read: false,
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      action: {
        label: 'View Opportunity',
        path: '/dashboard',
      },
    },
    {
      title: 'Deadline Reminder',
      message: 'Grant application due in 3 days',
      type: 'warning' as const,
      read: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      action: {
        label: 'View Details',
        path: '/criteria',
      },
    },
    {
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated',
      type: 'success' as const,
      read: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
  ];

  mockNotifications.forEach(addNotification);
}; 
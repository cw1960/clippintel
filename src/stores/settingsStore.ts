import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  types: {
    newOpportunities: boolean;
    deadlineReminders: boolean;
    matchUpdates: boolean;
    systemUpdates: boolean;
  };
}

interface FilterSettings {
  defaultCategory: string | null;
  defaultMinScore: number;
  autoApplyFilters: boolean;
  saveSearchHistory: boolean;
}

interface UISettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timezone: string;
  compactMode: boolean;
  showTooltips: boolean;
}

interface IntegrationSettings {
  supabaseUrl: string;
  supabaseKey: string;
  whopApiKey: string;
  rateLimitPerMinute: number;
  enableWebhooks: boolean;
  webhookUrl: string;
}

interface SettingsState {
  notifications: NotificationSettings;
  filters: FilterSettings;
  ui: UISettings;
  integrations: IntegrationSettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  updateFilterSettings: (settings: Partial<FilterSettings>) => void;
  updateUISettings: (settings: Partial<UISettings>) => void;
  updateIntegrationSettings: (settings: Partial<IntegrationSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settingsJson: string) => void;
}

const defaultSettings = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    frequency: 'daily' as const,
    types: {
      newOpportunities: true,
      deadlineReminders: true,
      matchUpdates: true,
      systemUpdates: false,
    },
  },
  filters: {
    defaultCategory: null,
    defaultMinScore: 70,
    autoApplyFilters: true,
    saveSearchHistory: true,
  },
  ui: {
    theme: 'dark' as const,
    language: 'en',
    dateFormat: 'MM/DD/YYYY' as const,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    compactMode: false,
    showTooltips: true,
  },
  integrations: {
    supabaseUrl: '',
    supabaseKey: '',
    whopApiKey: '',
    rateLimitPerMinute: 60,
    enableWebhooks: false,
    webhookUrl: '',
  },
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      isLoading: false,
      error: null,
      
      updateNotificationSettings: (settings) => {
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        }));
      },
      
      updateFilterSettings: (settings) => {
        set((state) => ({
          filters: { ...state.filters, ...settings },
        }));
      },
      
      updateUISettings: (settings) => {
        set((state) => ({
          ui: { ...state.ui, ...settings },
        }));
      },
      
      updateIntegrationSettings: (settings) => {
        set((state) => ({
          integrations: { ...state.integrations, ...settings },
        }));
      },
      
      resetToDefaults: () => {
        set({ ...defaultSettings });
      },
      
      exportSettings: () => {
        const { notifications, filters, ui, integrations } = get();
        return JSON.stringify({
          notifications,
          filters,
          ui,
          integrations,
        }, null, 2);
      },
      
      importSettings: (settingsJson) => {
        try {
          const settings = JSON.parse(settingsJson);
          set((state) => ({
            ...state,
            ...settings,
          }));
        } catch (error) {
          console.error('Failed to import settings:', error);
          set({ error: 'Failed to import settings' });
        }
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        filters: state.filters,
        ui: state.ui,
        integrations: state.integrations,
      }),
    }
  )
); 
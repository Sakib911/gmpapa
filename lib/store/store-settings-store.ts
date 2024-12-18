import { create } from 'zustand';

interface StoreSettings {
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  businessInfo: {
    address?: string;
    phone?: string;
    email?: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
    };
  };
  orderSettings: {
    autoFulfillment: boolean;
    lowStockThreshold: number;
    minimumOrderAmount: number;
  };
  notificationSettings: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    lowStockAlerts: boolean;
    marketingEmails: boolean;
  };
}

interface StoreSettingsStore {
  settings: StoreSettings | null;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
}

export const useStoreSettings = create<StoreSettingsStore>((set) => ({
  settings: null,
  loading: false,
  error: null,

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/reseller/store/settings');
      if (!response.ok) throw new Error('Failed to fetch store settings');
      const settings = await response.json();
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch settings',
        loading: false 
      });
    }
  },

  updateSettings: async (newSettings) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/reseller/store/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      
      if (!response.ok) throw new Error('Failed to update store settings');
      const settings = await response.json();
      
      set({ settings, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update settings',
        loading: false 
      });
    }
  },
}));
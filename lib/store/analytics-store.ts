import { create } from 'zustand';

interface AnalyticsData {
  revenue: {
    total: number;
    growth: number;
    chart: Array<{ date: string; value: number }>;
  };
  orders: {
    total: number;
    growth: number;
    chart: Array<{ date: string; value: number }>;
  };
  customers: {
    total: number;
    growth: number;
    chart: Array<{ date: string; value: number }>;
  };
  products: {
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
}

interface AnalyticsStore {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  timeframe: 'day' | 'week' | 'month' | 'year';
  setTimeframe: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  timeframe: 'month',

  setTimeframe: (timeframe) => set({ timeframe }),

  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/reseller/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
        loading: false 
      });
    }
  }
}));
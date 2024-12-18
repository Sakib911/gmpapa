'use client';

import { useEffect } from 'react';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { OverviewCards } from '@/components/analytics/OverviewCards';
import { RevenueChart } from '@/components/analytics/RevenueChart';
import { TopProducts } from '@/components/analytics/TopProducts';
import { useAnalyticsStore } from '@/lib/store/analytics-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { loading, error, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AnalyticsHeader />
      
      <div className="space-y-6">
        <OverviewCards />
        
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
          <RevenueChart />
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnalyticsStore } from '@/lib/store/analytics-store';
import { Download, RefreshCw } from 'lucide-react';

export function AnalyticsHeader() {
  const { timeframe, setTimeframe, fetchAnalytics } = useAnalyticsStore();

  const handleExport = () => {
    // TODO: Implement analytics export
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your store's performance and growth
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={timeframe}
          onValueChange={(value: 'day' | 'week' | 'month' | 'year') => {
            setTimeframe(value);
            fetchAnalytics();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Last 24 Hours</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchAnalytics()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
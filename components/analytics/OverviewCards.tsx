'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsStore } from '@/lib/store/analytics-store';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

export function OverviewCards() {
  const { data } = useAnalyticsStore();

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.revenue.total, 'USD')}
          </div>
          <p className={`text-xs ${
            data.revenue.growth >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {data.revenue.growth > 0 ? '+' : ''}
            {data.revenue.growth}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.orders.total}</div>
          <p className={`text-xs ${
            data.orders.growth >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {data.orders.growth > 0 ? '+' : ''}
            {data.orders.growth}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.customers.total}</div>
          <p className={`text-xs ${
            data.customers.growth >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {data.customers.growth > 0 ? '+' : ''}
            {data.customers.growth}% from last period
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Products</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.products.topSelling.length}
          </div>
          <p className="text-xs text-muted-foreground">
            Active best sellers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
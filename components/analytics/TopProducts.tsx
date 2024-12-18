'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsStore } from '@/lib/store/analytics-store';
import { formatCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';

export function TopProducts() {
  const { data } = useAnalyticsStore();

  if (!data) return null;

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.products.topSelling.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.sales} sales
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatCurrency(product.revenue, 'USD')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Revenue
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
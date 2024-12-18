'use client';

import { ThemeCustomizer } from '@/components/store/ThemeCustomizer';
import { useResellerStore } from '@/hooks/use-reseller-store';
import { Loader2 } from 'lucide-react';

export default function StoreThemePage() {
  const { store, loading, error, updateTheme } = useResellerStore();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load store settings</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Store Theme</h1>
        <p className="text-muted-foreground">
          Customize your store's appearance and branding
        </p>
      </div>

      <ThemeCustomizer onSave={updateTheme} />
    </div>
  );
}
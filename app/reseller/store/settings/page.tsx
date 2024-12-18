'use client';

import { StoreSettingsForm } from '@/components/store/StoreSettingsForm';
import { useStoreSettings } from '@/lib/store/store-settings-store';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function StoreSettingsPage() {
  const { settings, loading, error, fetchSettings } = useStoreSettings();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage your store's settings and preferences
        </p>
      </div>

      <StoreSettingsForm settings={settings} />
    </div>
  );
}
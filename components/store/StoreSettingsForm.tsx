'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';
import { useStoreSettings } from '@/lib/store/store-settings-store';

interface StoreSettingsFormProps {
  settings: any;
}

export function StoreSettingsForm({ settings }: StoreSettingsFormProps) {
  const { updateSettings } = useStoreSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        businessInfo: {
          address: formData.get('address'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          socialLinks: {
            facebook: formData.get('facebook'),
            twitter: formData.get('twitter'),
            instagram: formData.get('instagram'),
          },
        },
        orderSettings: {
          autoFulfillment: formData.get('autoFulfillment') === 'on',
          lowStockThreshold: parseInt(formData.get('lowStockThreshold') as string),
          minimumOrderAmount: parseFloat(formData.get('minimumOrderAmount') as string),
        },
        notificationSettings: {
          emailNotifications: formData.get('emailNotifications') === 'on',
          orderUpdates: formData.get('orderUpdates') === 'on',
          lowStockAlerts: formData.get('lowStockAlerts') === 'on',
          marketingEmails: formData.get('marketingEmails') === 'on',
        },
      };

      await updateSettings(data);

      toast({
        title: 'Success',
        description: 'Store settings updated successfully',
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={settings?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Store Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={settings?.description}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={settings?.businessInfo?.address}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={settings?.businessInfo?.phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={settings?.businessInfo?.email}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Social Links</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  defaultValue={settings?.businessInfo?.socialLinks?.facebook}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  defaultValue={settings?.businessInfo?.socialLinks?.twitter}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  defaultValue={settings?.businessInfo?.socialLinks?.instagram}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Order Fulfillment</Label>
              <p className="text-sm text-muted-foreground">
                Automatically process orders when payment is received
              </p>
            </div>
            <Switch
              name="autoFulfillment"
              defaultChecked={settings?.orderSettings?.autoFulfillment}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                defaultValue={settings?.orderSettings?.lowStockThreshold}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumOrderAmount">Minimum Order Amount</Label>
              <Input
                id="minimumOrderAmount"
                name="minimumOrderAmount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={settings?.orderSettings?.minimumOrderAmount}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              name="emailNotifications"
              defaultChecked={settings?.notificationSettings?.emailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Order Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about order status changes
              </p>
            </div>
            <Switch
              name="orderUpdates"
              defaultChecked={settings?.notificationSettings?.orderUpdates}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when products are running low
              </p>
            </div>
            <Switch
              name="lowStockAlerts"
              defaultChecked={settings?.notificationSettings?.lowStockAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              name="marketingEmails"
              defaultChecked={settings?.notificationSettings?.marketingEmails}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
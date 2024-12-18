"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Store, Globe, Settings } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';

const REGISTRATION_FEE = 1000; // BDT

export default function ResellerRegister() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    
    // Business Info
    businessName: '',
    businessDescription: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },
    
    // Store Settings
    storeName: '',
    storeDescription: '',
    domainType: 'subdomain',
    customDomain: '',
    subdomainPrefix: '',
    
    // Store Configuration
    settings: {
      defaultMarkup: 20,
      minimumMarkup: 10,
      maximumMarkup: 50,
      autoFulfillment: true,
      lowBalanceAlert: 100,
      notifications: {
        email: true,
        orderUpdates: true,
        lowStock: true,
        promotions: true
      }
    }
  });

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: Store },
    { id: 'business', title: 'Business Info', icon: Globe },
    { id: 'store', title: 'Store Setup', icon: Settings }
  ];

  const validateStep = (step: number) => {
    switch (step) {
      case 0: // Personal Info
        return formData.name && formData.email && formData.password && formData.phoneNumber;
      case 1: // Business Info
        return formData.businessName && formData.businessDescription;
      case 2: // Store Setup
        if (formData.domainType === 'subdomain') {
          return formData.subdomainPrefix.length >= 3;
        } else {
          return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(formData.customDomain);
        }
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reseller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      const { paymentId, bkashURL } = await response.json();
      window.location.href = bkashURL;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Become a Reseller</h1>
            <p className="text-muted-foreground mt-2">
              Set up your gaming store and start earning
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-4">
            <Progress value={((currentStep + 1) / steps.length) * 100} />
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    index <= currentStep ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Registration fee: {formatCurrency(REGISTRATION_FEE, 'BDT')}
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    value={formData.businessDescription}
                    onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.businessAddress.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessAddress: { ...formData.businessAddress, street: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.businessAddress.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessAddress: { ...formData.businessAddress, city: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.businessAddress.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessAddress: { ...formData.businessAddress, state: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.businessAddress.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessAddress: { ...formData.businessAddress, country: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.businessAddress.postalCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        businessAddress: { ...formData.businessAddress, postalCode: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription">Store Description</Label>
                    <Textarea
                      id="storeDescription"
                      value={formData.storeDescription}
                      onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Domain Settings</Label>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="subdomain"
                        value="subdomain"
                        checked={formData.domainType === 'subdomain'}
                        onChange={(e) => setFormData({ ...formData, domainType: e.target.value })}
                      />
                      <Label htmlFor="subdomain">Use a Subdomain (Free)</Label>
                    </div>

                    {formData.domainType === 'subdomain' && (
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder="mystore"
                          value={formData.subdomainPrefix}
                          onChange={(e) => setFormData({
                            ...formData,
                            subdomainPrefix: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                          })}
                          className="flex-1"
                        />
                        <span className="text-muted-foreground">.gmpapa.com</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="custom"
                        value="custom"
                        checked={formData.domainType === 'custom'}
                        onChange={(e) => setFormData({ ...formData, domainType: e.target.value })}
                      />
                      <Label htmlFor="custom">Use Custom Domain</Label>
                    </div>

                    {formData.domainType === 'custom' && (
                      <div className="space-y-2">
                        <Input
                          placeholder="store.example.com"
                          value={formData.customDomain}
                          onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter your domain without http:// or https://
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Store Configuration</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="defaultMarkup">Default Markup (%)</Label>
                      <Input
                        id="defaultMarkup"
                        type="number"
                        min={formData.settings.minimumMarkup}
                        max={formData.settings.maximumMarkup}
                        value={formData.settings.defaultMarkup}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            defaultMarkup: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowBalanceAlert">Low Balance Alert (BDT)</Label>
                      <Input
                        id="lowBalanceAlert"
                        type="number"
                        min="0"
                        value={formData.settings.lowBalanceAlert}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: {
                            ...formData.settings,
                            lowBalanceAlert: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || loading}
              >
                Previous
              </Button>
              
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!validateStep(currentStep) || loading}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={!validateStep(currentStep) || loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete & Pay {formatCurrency(REGISTRATION_FEE, 'BDT')}
                </Button>
              )}
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
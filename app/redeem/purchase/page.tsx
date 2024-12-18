'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Gift, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function PurchaseRedeemCodePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [error, setError] = useState('');
  const [codes, setCodes] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/admin/redeem-codes?status=active');
      if (!response.ok) throw new Error('Failed to fetch redeem codes');
      const data = await response.json();
      
      // Group codes by amount to show available quantities
      const groupedCodes = data.codes.reduce((acc: any, code: any) => {
        if (!acc[code.amount]) {
          acc[code.amount] = {
            amount: code.amount,
            quantity: 1
          };
        } else {
          acc[code.amount].quantity++;
        }
        return acc;
      }, {});

      setCodes(Object.values(groupedCodes));
    } catch (error) {
      console.error('Failed to fetch redeem codes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load redeem codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    redirect('/auth/signin');
  }

  const handlePurchase = async (amount: number) => {
    setPurchaseLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process purchase');
      }

      const { paymentId, bkashURL } = await response.json();
      
      // Redirect to payment status page
      router.push(`/checkout/${paymentId}/status`);
    } catch (error) {
      console.error('Purchase error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process purchase');
      toast({
        title: 'Error',
        description: 'Failed to process purchase',
        variant: 'destructive',
      });
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Purchase Redeem Code</h1>
          <p className="text-muted-foreground mt-2">
            Select an amount to purchase a redeem code
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {codes.map((item) => (
            <Card key={item.amount} className="relative overflow-hidden hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {formatCurrency(item.amount, 'BDT')}
                </CardTitle>
                <CardDescription>
                  {item.quantity} codes available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      ✓ Instant delivery after payment
                    </li>
                    <li className="flex items-center">
                      ✓ Can be used immediately
                    </li>
                    <li className="flex items-center">
                      ✓ Valid for all supported games
                    </li>
                  </ul>

                  <Button 
                    className="w-full" 
                    onClick={() => handlePurchase(item.amount)}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <CreditCard className="mr-2 h-4 w-4" />
                    Purchase Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Alert>
          <Gift className="h-4 w-4" />
          <AlertDescription>
            After successful payment, you'll receive your redeem code instantly.
            The code can be used to add balance to your wallet.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
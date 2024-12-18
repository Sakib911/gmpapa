'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Gift, CheckCircle2, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function VerifyRedeemCodePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{
    amount: number;
    balance: number;
  } | null>(null);
  const { toast } = useToast();

  if (!session) {
    redirect('/auth/signin');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await fetch('/api/redeem/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      setSuccess({
        amount: data.amount,
        balance: data.balance
      });
      setCode('');
      toast({
        title: 'Success',
        description: `${formatCurrency(data.amount, 'BDT')} has been added to your wallet`,
      });
    } catch (error) {
      console.error('Verification error:', error);
      setError(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-purple-900/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <CardTitle>Verify Redeem Code</CardTitle>
            </div>
            <CardDescription>
              Enter your redeem code to add balance to your wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex flex-col gap-1">
                      <span>Successfully redeemed {formatCurrency(success.amount, 'BDT')}!</span>
                      <span className="flex items-center gap-1">
                        <Wallet className="h-4 w-4" />
                        New balance: {formatCurrency(success.balance, 'BDT')}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Input
                  placeholder="Enter redeem code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={loading || !code.trim()}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-purple-900/20 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Need a Redeem Code?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can purchase redeem codes from our store. Choose from various denominations and top up your wallet instantly.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/redeem/purchase">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Redeem Code
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
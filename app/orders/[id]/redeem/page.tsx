'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RedeemCodePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRedeemCode();
  }, [params.id]);

  const fetchRedeemCode = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/redeem`);
      if (!response.ok) throw new Error('Failed to fetch redeem code');
      const data = await response.json();
      setRedeemCode(data.redeemCode);
    } catch (error) {
      console.error('Failed to fetch redeem code:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch redeem code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(redeemCode);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Redeem code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-red-500/10">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>

          <Button asChild>
            <Link href="/orders">View All Orders</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Your Redeem Code</h1>
        <p className="text-muted-foreground mb-6">
          Copy your redeem code and use it to add balance to your wallet
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <code className="font-mono text-lg">{redeemCode}</code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Alert>
            <AlertDescription>
              This code can only be used once and will expire after redemption.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link href="/redeem">Go to Redeem Page</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
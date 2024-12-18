'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Gift, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyRedeemCodesPage() {
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<any[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/user/redeem-codes');
      if (!response.ok) throw new Error('Failed to fetch redeem codes');
      const data = await response.json();
      setCodes(data);
    } catch (error) {
      console.error('Failed to fetch codes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load redeem codes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Redeem code copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Redeem Codes</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your redeem codes
          </p>
        </div>
        <Button asChild>
          <Link href="/redeem/purchase">
            <Gift className="w-4 h-4 mr-2" />
            Get New Code
          </Link>
        </Button>
      </div>

      {codes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Redeem Codes</h3>
            <p className="text-muted-foreground mb-4">
              You haven't purchased any redeem codes yet
            </p>
            <Button asChild>
              <Link href="/redeem/purchase">Purchase Redeem Code</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {codes.map((code) => (
            <Card key={code._id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{formatCurrency(code.amount, 'BDT')}</CardTitle>
                  <Badge
                    variant={
                      code.status === 'active'
                        ? 'default'
                        : code.status === 'used'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {code.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <code className="font-mono">{code.code}</code>
                    {code.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(code.code)}
                      >
                        {copied === code.code ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>

                  {code.status === 'active' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This code will expire on {new Date(code.expiresAt).toLocaleDateString()}
                      </AlertDescription>
                    </Alert>
                  )}

                  {code.status === 'active' && (
                    <Button asChild className="w-full">
                      <Link href="/redeem/verify">
                        Redeem Now
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
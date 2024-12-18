'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, CreditCard, ShoppingCart } from 'lucide-react';

export default function GameCardsPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/redeem-cards');
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
      toast({
        title: 'Error',
        description: 'Failed to load game cards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (cardId: string) => {
    try {
      const response = await fetch('/api/checkout/redeem-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate purchase');
      }

      const { paymentId, bkashURL } = await response.json();
      router.push(`/checkout/${paymentId}/status`);
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process purchase',
        variant: 'destructive',
      });
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Game Cards</h1>
        <p className="text-muted-foreground mt-2">
          Purchase game cards to top up your gaming accounts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card._id} className="relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge variant="secondary">
                <CreditCard className="w-3 h-3 mr-1" />
                Game Card
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {formatCurrency(card.amount, 'BDT')}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {card.description && (
                  <p className="text-muted-foreground">
                    {card.description}
                  </p>
                )}
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    ✓ Instant delivery after payment
                  </li>
                  <li className="flex items-center">
                    ✓ Valid for all supported games
                  </li>
                  <li className="flex items-center">
                    ✓ 24/7 support available
                  </li>
                </ul>

                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(card._id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Purchase Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
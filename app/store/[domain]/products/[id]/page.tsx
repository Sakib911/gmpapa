'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatCurrency } from '@/lib/utils';
import { Zap, Star, AlertCircle } from 'lucide-react';
import { AddToCartButton } from '@/components/store/AddToCartButton';
import Image from 'next/image';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/store/${params.domain}/products/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
      if (data.subProducts.length > 0) {
        setSelectedVariant(data.subProducts[0]);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-[400px] lg:h-[600px]">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {product.instantDelivery && (
              <Badge variant="secondary">
                <Zap className="w-3 h-3 mr-1" />
                Instant Delivery
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-yellow-500">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-lg text-muted-foreground">
              {product.region} • {product.category.replace(/_/g, ' ')}
            </p>
          </div>

          {/* Product Description */}
          <div className="prose dark:prose-invert">
            <p>{product.description}</p>
          </div>

          {/* Variants Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Select Package</h2>
            <div className="space-y-4">
              {product.subProducts.map((variant: any) => (
                <div
                  key={variant.name}
                  className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
                    selectedVariant?.name === variant.name
                      ? 'border-primary bg-primary/10'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{variant.name}</h3>
                      {variant.inStock ? (
                        <p className="text-sm text-green-500">In Stock</p>
                      ) : (
                        <p className="text-sm text-destructive">Out of Stock</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {formatCurrency(variant.price, 'USD')}
                      </div>
                      {variant.originalPrice > variant.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(variant.originalPrice, 'USD')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Important Note */}
          {product.importantNote && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{product.importantNote}</AlertDescription>
            </Alert>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton
            productId={product._id}
            subProductName={selectedVariant?.name || ''}
            disabled={!selectedVariant?.inStock}
          />

          {/* Usage Guide */}
          {product.guideEnabled && product.guide && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <div className="prose dark:prose-invert max-w-none">
                {product.guide}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Zap, Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function StorePage() {
  const params = useParams();
  const [store, setStore] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStore();
  }, [params.domain]);

  const fetchStore = async () => {
    try {
      const [storeResponse, productsResponse] = await Promise.all([
        fetch(`/api/store/${params.domain}`),
        fetch(`/api/store/${params.domain}/products?featured=true`)
      ]);

      if (!storeResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch store data');
      }

      const [storeData, productsData] = await Promise.all([
        storeResponse.json(),
        productsResponse.json()
      ]);

      setStore(storeData);
      setFeaturedProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch store:', error);
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

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground">
            The store you're looking for doesn't exist or has been suspended.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative">
        {store.banner ? (
          <div className="relative h-[400px]">
            <Image
              src={store.banner}
              alt={store.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {store.name}
                </h1>
                <p className="text-lg md:text-xl max-w-2xl mx-auto px-4">
                  {store.description}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="h-[400px] flex items-center justify-center"
            style={{ backgroundColor: store.theme.primaryColor + '20' }}
          >
            <div className="text-center">
              <h1 
                className="text-4xl md:text-6xl font-bold mb-4"
                style={{ color: store.theme.primaryColor }}
              >
                {store.name}
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto px-4 text-muted-foreground">
                {store.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              Our most popular gaming products
            </p>
          </div>
          <Button asChild>
            <Link href={`/store/${params.domain}/products`}>
              View All Products
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link 
              key={product._id} 
              href={`/store/${params.domain}/products/${product._id}`}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {product.instantDelivery && (
                      <Badge variant="secondary">
                        <Zap className="w-3 h-3 mr-1" />
                        Instant
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
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.region} • {product.category.replace(/_/g, ' ')}
                  </p>
                  
                  {product.subProducts && product.subProducts.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {product.subProducts[0].name}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(product.subProducts[0].price, 'USD')}
                        </span>
                      </div>
                      {product.subProducts.length > 1 && (
                        <p className="text-xs text-muted-foreground">
                          +{product.subProducts.length - 1} more options
                        </p>
                      )}
                    </div>
                  )}

                  <Button className="w-full mt-4">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div 
        className="py-12"
        style={{ backgroundColor: store.theme.primaryColor + '10' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: store.theme.primaryColor + '20' }}
              >
                <Zap 
                  className="h-6 w-6"
                  style={{ color: store.theme.primaryColor }}
                />
              </div>
              <h3 className="font-semibold mb-2">Instant Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Get your gaming products delivered instantly after payment
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: store.theme.primaryColor + '20' }}
              >
                <ShoppingCart 
                  className="h-6 w-6"
                  style={{ color: store.theme.primaryColor }}
                />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Safe and secure payment methods for your purchases
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: store.theme.primaryColor + '20' }}
              >
                <Star 
                  className="h-6 w-6"
                  style={{ color: store.theme.primaryColor }}
                />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Round-the-clock customer support for all your needs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
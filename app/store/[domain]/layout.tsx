'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    fetchStore();
  }, [params.domain]);

  const fetchStore = async () => {
    try {
      const response = await fetch(`/api/store/${params.domain}`);
      if (!response.ok) throw new Error('Failed to fetch store');
      const data = await response.json();
      setStore(data);
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
    <div 
      className="min-h-screen"
      style={{ backgroundColor: store.theme.backgroundColor }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Store Name */}
            <div className="flex items-center gap-4">
              {store.logo ? (
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  className="h-8 w-auto"
                />
              ) : (
                <h1 
                  className="text-xl font-bold"
                  style={{ color: store.theme.primaryColor }}
                >
                  {store.name}
                </h1>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href={`/store/${params.domain}`}
                className="text-sm font-medium hover:text-primary"
              >
                Home
              </Link>
              <Link 
                href={`/store/${params.domain}/products`}
                className="text-sm font-medium hover:text-primary"
              >
                Products
              </Link>
              <Link 
                href={`/store/${params.domain}/contact`}
                className="text-sm font-medium hover:text-primary"
              >
                Contact
              </Link>
            </nav>

            {/* Search & Cart */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 w-[200px] lg:w-[300px]"
                />
              </div>

              <Button 
                variant="outline" 
                size="icon"
                className="relative"
                asChild
              >
                <Link href={`/store/${params.domain}/cart`}>
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 border-b">
                      <h2 className="font-semibold">Menu</h2>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <nav className="flex flex-col gap-4 py-4">
                      <Link 
                        href={`/store/${params.domain}`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium hover:text-primary"
                      >
                        Home
                      </Link>
                      <Link 
                        href={`/store/${params.domain}/products`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium hover:text-primary"
                      >
                        Products
                      </Link>
                      <Link 
                        href={`/store/${params.domain}/contact`}
                        onClick={() => setOpen(false)}
                        className="text-sm font-medium hover:text-primary"
                      >
                        Contact
                      </Link>
                    </nav>

                    <div className="mt-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search products..."
                          className="pl-9 w-full"
                        />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                {store.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <nav className="space-y-2">
                <Link 
                  href={`/store/${params.domain}/products`}
                  className="block text-sm text-muted-foreground hover:text-primary"
                >
                  Products
                </Link>
                <Link 
                  href={`/store/${params.domain}/contact`}
                  className="block text-sm text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
                <Link 
                  href={`/store/${params.domain}/terms`}
                  className="block text-sm text-muted-foreground hover:text-primary"
                >
                  Terms & Conditions
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              {store.businessInfo?.phone && (
                <p className="text-sm text-muted-foreground mb-2">
                  Phone: {store.businessInfo.phone}
                </p>
              )}
              {store.businessInfo?.email && (
                <p className="text-sm text-muted-foreground mb-2">
                  Email: {store.businessInfo.email}
                </p>
              )}
              {store.businessInfo?.address && (
                <p className="text-sm text-muted-foreground">
                  Address: {store.businessInfo.address}
                </p>
              )}
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {store.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
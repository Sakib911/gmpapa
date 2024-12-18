import { Button } from '@/components/ui/button';
import { Features } from '@/components/home/Features';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import { Gamepad2, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-blue-600/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Zap className="h-4 w-4" />
                Instant Gaming Top-ups & Gift Cards
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                Level Up Your Gaming Experience
              </span>
            </h1>
            
            <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-400">
              Your one-stop destination for game cards, top-ups, and digital gaming products. 
              Fast, secure, and trusted by gamers worldwide.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Browse Products
                </Button>
              </Link>
              <Link href="/auth/reseller/register">
                <Button size="lg" variant="outline" className="border-primary/20">
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Become a Reseller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black/50 border-y border-primary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-gray-400">Games Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-gray-400">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-sm text-gray-400">Transactions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <Features />

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <p className="text-gray-400">Most popular gaming products</p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="border-primary/20">
              View All Products
            </Button>
          </Link>
        </div>
        <FeaturedProducts />
      </div>

      {/* CTA Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Gaming?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of gamers who trust us for their gaming needs. 
            Fast delivery, secure payments, and 24/7 support.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <CreditCard className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
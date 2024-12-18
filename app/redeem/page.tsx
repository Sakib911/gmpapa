import { Button } from '@/components/ui/button';
import { Features } from '@/components/home/Features';
import { FeaturedProducts } from '@/components/store/FeaturedProducts';
import Link from 'next/link';
import { Gift, CreditCard, Wallet } from 'lucide-react';

export default function RedeemPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 tracking-tight">
              Redeem & Play
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-400">
              Purchase or redeem game codes instantly and top up your gaming wallet
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/redeem/purchase">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Purchase Code
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/redeem/verify">
                  <Gift className="mr-2 h-4 w-4" />
                  Redeem Code
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-900/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Purchase Code</h3>
                  <p className="mt-2 text-gray-400">
                    Buy a redeem code of your desired amount
                  </p>
                </div>
              </div>
            </div>

            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-900/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500">
                    <Gift className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Enter Code</h3>
                  <p className="mt-2 text-gray-400">
                    Enter your code in the redeem section
                  </p>
                </div>
              </div>
            </div>

            <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-900/70 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500">
                    <Wallet className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Get Balance</h3>
                  <p className="mt-2 text-gray-400">
                    Amount is instantly added to your wallet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold mb-8">Popular Game Cards</h2>
        <FeaturedProducts />
      </div>
    </div>
  );
}
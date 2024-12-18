'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Users,
  Package,
  LogOut,
  Store,
  Wallet,
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/reseller', icon: LayoutDashboard },
  { name: 'Orders', href: '/reseller/orders', icon: ShoppingCart },
  { name: 'Products', href: '/reseller/products', icon: Package },
  { name: 'Customers', href: '/reseller/customers', icon: Users },
  { name: 'Wallet', href: '/reseller/wallet', icon: CreditCard },
  { name: 'Store', href: '/reseller/store', icon: Store },
  { name: 'Settings', href: '/reseller/settings', icon: Settings },
];

export default function ResellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  // Redirect if not reseller
  if (status === 'authenticated' && session.user.role !== 'reseller') {
    redirect('/');
  }

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    redirect('/auth/reseller/signin');
  }

  const NavContent = () => (
    <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <h1 className="text-xl font-bold">Reseller Dashboard</h1>
      </div>
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-primary/5'
                )}
                onClick={() => setOpen(false)}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                />
                {item.name}
                {item.name === 'Wallet' && (
                  <div className="ml-auto flex items-center">
                    <div className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                      <Wallet className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex-shrink-0 flex border-t p-4">
          <Button
            variant="ghost"
            className="flex items-center w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-card border-r">
            <NavContent />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-lg font-bold">Reseller Dashboard</h1>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <NavContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none md:pt-0 pt-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
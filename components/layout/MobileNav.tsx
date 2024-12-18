'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import {
  Home,
  Package,
  ShoppingCart,
  User,
  Menu,
  X,
  LogIn,
  LogOut,
  Gift,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { signOut } from 'next-auth/react';

export function MobileNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  // Don't show in admin or reseller routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/reseller')) {
    return null;
  }

  const mainNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Browse Games', icon: Gamepad2 },
    { href: '/cart', label: 'Cart', icon: ShoppingCart, count: itemCount },
    { href: '/redeem', label: 'Redeem', icon: Gift },
  ];

  const accountNavItems = session ? [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/orders', label: 'Orders', icon: Package },
  ] : [
    { href: '/auth/signin', label: 'Sign In', icon: LogIn },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <nav className="flex items-center">
        {mainNavItems.slice(0, 3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2 px-1 text-sm relative',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className="relative flex flex-col items-center justify-center"> {/* Make this a flex container */}
              <item.icon className="h-5 w-5" />
                {item.label === 'Cart' && item.count && item.count > 0 && (
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {item.count}
                </span>
              )}
              <span className="mt-1 text-xs">{item.label}</span>
            </div>
          </Link>
        ))}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-1 flex flex-col items-center justify-center h-auto py-2">
              <Menu className="h-5 w-5" />
              <span className="mt-1 text-xs">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between py-2">
                <span className="text-lg font-semibold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {[...mainNavItems.slice(3), ...accountNavItems].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center py-2 px-3 rounded-lg hover:bg-accent',
                        pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {session && (
                <div className="border-t pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
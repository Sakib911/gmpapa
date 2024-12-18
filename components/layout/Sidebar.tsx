'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  Home,
  Gamepad2,
  ShoppingCart,
  Gift,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useCart } from '@/hooks/use-cart';
import { useState, useEffect } from 'react';

const mainNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Browse Games', icon: Gamepad2 },
  { href: '/redeem', label: 'Redeem Card', icon: Gift },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { itemCount } = useCart();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768); // Use 768px as breakpoint for mobile/desktop
        };
    
        handleResize(); // Initial check
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }, []);


  // Don't show the sidebar in admin or reseller routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/reseller')) {
    return null;
  }

  return (
    <div className="hidden md:flex w-64 border-r bg-card/50 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center justify-center">
            <div className="relative group">
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              
              {/* Logo container */}
              <div className="relative px-6 py-3 bg-black rounded-lg ring-1 ring-purple-600/20">
                {/* GM part */}
                <span className="font-black text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  GM
                </span>
                
                {/* PAPA part */}
                <span className="font-black text-2xl bg-gradient-to-br from-white via-white to-purple-400 bg-clip-text text-transparent ml-0.5">
                  PAPA
                </span>
                
                {/* Accent dots */}
                <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                <div className="absolute -left-1 -bottom-1 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-4 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-2 transition-colors',
                    pathname === item.href && 'bg-primary/10 text-primary'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/cart">
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2',
                  pathname === '/cart' && 'bg-primary/10 text-primary'
                )}
              >
               <div className="relative md:mr-2">
                  <ShoppingCart className="h-5 w-5 md:hidden" />
                  {!isMobile && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>

                Cart
                 {isMobile && itemCount > 0 && (
                    <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
              </Button>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="pt-4 space-y-2">
            <div className="px-2 py-2 text-xs font-semibold text-muted-foreground">
              Account
            </div>
            {session ? (
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
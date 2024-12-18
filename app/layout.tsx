import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { SearchHeader } from '@/components/layout/SearchHeader';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from 'sonner';
import { MobileNav } from '@/components/layout/MobileNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VertexBazar - Gaming Marketplace',
  description: 'Your one-stop destination for game cards, top-ups, and digital gaming products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            
            <main className="flex-1 flex flex-col">
              <SearchHeader />
              <div className="flex-1 overflow-auto">
                {children}
              </div>
              
              {/* Mobile Navigation */}
              <div className="md:hidden">
                <MobileNav />
              </div>
            </main>
          </div>
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
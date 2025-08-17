
'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { AuthProvider } from '@/hooks/use-auth';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';

// Metadata cannot be exported from a client component.
// We can either move this to a server component or handle it dynamically.
// For now, we will keep it simple.
// export const metadata: Metadata = {
//   title: 'Howzue - Your Mood Companion',
//   description: 'Track your mood, journal your thoughts, and gain insights with Howzue.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
          <Providers>
            {isLoginPage ? (
              children
            ) : (
              <AppShell>{children}</AppShell>
            )}
            <Toaster />
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}

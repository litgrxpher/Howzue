
'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Book, BarChart2, Settings, Menu } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/journal', label: 'Journal', icon: Book },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function NavMenu() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  
  return (
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label }}
            >
              <Link href={item.href}>
                <item.icon />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isAuthLoaded } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(isMobile);
  
  useEffect(() => {
    if (isAuthLoaded && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoaded, router]);


  React.useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [isMobile]);
  
  const sidebarContent = (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu />
      </SidebarContent>
    </>
  );

  if (!user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-2xl">Loading...</div>
        </div>
    )
  }

  return (
    <SidebarProvider isCollapsed={isSidebarCollapsed || false} isMobile={isMobile || false}>
        <Sidebar
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            isCollapsed={isSidebarCollapsed || false}
            onCollapse={setIsSidebarCollapsed}
            collapsible="button"
        >
            {sidebarContent}
        </Sidebar>
        <div
            className={cn(
            'transition-all duration-300 ease-in-out',
            !isSidebarCollapsed && !isMobile
                ? 'md:pl-[var(--sidebar-width)]'
                : 'md:pl-[var(--sidebar-width-icon)]'
            )}
        >
            <header className="sticky top-0 z-10 flex items-center h-14 bg-background/80 backdrop-blur-sm border-b px-4 md:hidden">
            <SidebarTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </SidebarTrigger>
            <div className="ml-4">
                <Logo />
            </div>
            </header>
            <main className="p-4 sm:p-6 md:p-8">{children}</main>
        </div>
    </SidebarProvider>
  );
}

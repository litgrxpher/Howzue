
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Book, BarChart2, Settings, Menu, Bot } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/journal', label: 'Journal', icon: Book },
  { href: '/insights', label: 'Insights', icon: BarChart2 },
  { href: '/companion', label: 'Companion', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleCollapse = (collapsed: boolean) => {
    setSidebarOpen(!collapsed);
  };
  
  const sidebarContent = (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
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
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );

  return (
    <SidebarProvider isCollapsed={!isSidebarOpen} isMobile={isMobile}>
        <Sidebar
            isCollapsed={!isSidebarOpen}
            onCollapse={handleCollapse}
            isMobile={isMobile}
        >
            {sidebarContent}
        </Sidebar>
        <div
            className={cn(
            'transition-all duration-300 ease-in-out',
            isSidebarOpen && !isMobile
                ? 'md:pl-[var(--sidebar-width)]'
                : 'md:pl-[var(--sidebar-width-icon)]'
            )}
        >
            <header className="sticky top-0 z-10 flex items-center h-14 bg-background/80 backdrop-blur-sm border-b px-4 md:hidden">
            <SidebarTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                    {sidebarContent}
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

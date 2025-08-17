
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Book, BarChart2, Settings, Menu, Bot } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const sidebarContent = (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <a>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        {sidebarContent}
      </Sidebar>
      <div className="md:pl-[calc(var(--sidebar-width-icon))] transition-all duration-200 ease-linear group-data-[sidebar-collapsed=false]:md:pl-[var(--sidebar-width-icon)]">
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

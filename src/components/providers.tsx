
'use client';

import { AppContext, useApp, useAppStore } from '@/hooks/use-app-store';
import React, { useEffect } from 'react';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useApp();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const ThemeManager = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(settings.theme);
  }, [settings.theme]);

  return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ThemeManager>{children}</ThemeManager>
    </AppProvider>
  );
}

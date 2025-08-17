
'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { differenceInCalendarDays, isSameDay, startOfWeek, subDays } from 'date-fns';
import type { JournalEntry, Settings, Mood } from '@/lib/types';
import { useAuth } from './use-auth';

interface AppState {
  entries: JournalEntry[];
  settings: Settings;
  streak: number;
  weeklyAverageMood: number | null;
  addEntry: (entry: { mood: Mood; text: string }) => Promise<void>;
  updateSettings: (newSettings: Settings) => void;
  deleteAllData: () => Promise<void>;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const defaultSettings: Settings = {
  theme: 'system',
};

const useLocalStore = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};


export const useApp = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useLocalStore<JournalEntry[]>(`howzue-entries-${user?.id || 'guest'}`, []);
  const [settings, setSettings] = useLocalStore<Settings>('howzue-settings', defaultSettings);
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  useEffect(() => {
    setIsStoreLoaded(true);
  }, []);

  const addEntry = useCallback(async (newEntryData: { mood: Mood; text: string }) => {
    const newEntry: JournalEntry = {
      id: new Date().toISOString() + Math.random(), // Simple unique ID
      ...newEntryData,
      date: new Date().toISOString(),
    };
    
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  }, [setEntries]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const deleteAllData = useCallback(async () => {
    setEntries([]);
  }, [setEntries]);
  
  const streak = useMemo(() => {
    if (entries.length === 0) return 0;
    const sortedDates = entries
      .map((e) => new Date(e.date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    const uniqueDates = sortedDates.filter((date, index, self) =>
      index === self.findIndex((d) => isSameDay(d, date))
    );

    if (uniqueDates.length === 0) return 0;
    
    let currentStreak = 0;
    const today = new Date();
    const hasEntryToday = uniqueDates.some(d => isSameDay(d, today));
    const hasEntryYesterday = uniqueDates.some(d => isSameDay(d, subDays(today, 1)));

    if (hasEntryToday || hasEntryYesterday) {
       if (hasEntryToday) {
         currentStreak = 1;
       } else { // has entry yesterday but not today
         currentStreak = 1;
         uniqueDates.unshift(subDays(today, 1)); // to make logic simpler
       }
       
       for (let i = 1; i < uniqueDates.length; i++) {
         const diff = differenceInCalendarDays(uniqueDates[i-1], uniqueDates[i]);
         if (diff === 1) {
           currentStreak++;
         } else {
           break;
         }
       }
    }
    
    return currentStreak;
  }, [entries]);

  const weeklyAverageMood = useMemo(() => {
    const today = new Date();
    const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weekEntries = entries.filter(e => new Date(e.date) >= startOfThisWeek);
    
    if (weekEntries.length === 0) return null;
    
    const moodValues = { 'great': 5, 'good': 4, 'okay': 3, 'bad': 2, 'awful': 1 };
    const totalMoodValue = weekEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    
    return totalMoodValue / weekEntries.length;
  }, [entries]);

  return {
    entries,
    settings,
    streak,
    weeklyAverageMood,
    addEntry,
    updateSettings,
    deleteAllData,
  };
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};


'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { differenceInCalendarDays, isSameDay, startOfWeek, subDays } from 'date-fns';
import type { JournalEntry, Settings } from '@/lib/types';

interface AppState {
  entries: JournalEntry[];
  settings: Settings;
  streak: number;
  weeklyAverageMood: number | null;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  updateSettings: (newSettings: Settings) => void;
  deleteAllData: () => void;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const defaultSettings: Settings = {
  theme: 'system',
};

export const useApp = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedEntries = localStorage.getItem('howzue-entries');
      const storedSettings = localStorage.getItem('howzue-settings');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('howzue-entries', JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  useEffect(() => {
    if(isLoaded) {
      localStorage.setItem('howzue-settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const addEntry = (newEntryData: Omit<JournalEntry, 'id' | 'date'>) => {
    const today = new Date();
    const existingEntryIndex = entries.findIndex((entry) =>
      isSameDay(new Date(entry.date), today)
    );

    let updatedEntries;
    if (existingEntryIndex > -1) {
      // Update today's entry
      updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        ...newEntryData,
      };
    } else {
      // Add a new entry
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        date: today.toISOString(),
        ...newEntryData,
      };
      updatedEntries = [...entries, newEntry];
    }
    
    // Sort entries by date just in case
    updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setEntries(updatedEntries);
  };
  
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const deleteAllData = () => {
    setEntries([]);
    localStorage.removeItem('howzue-entries');
  };

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

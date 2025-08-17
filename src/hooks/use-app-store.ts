
'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { differenceInCalendarDays, isSameDay, startOfWeek, subDays } from 'date-fns';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  writeBatch,
  doc,
} from 'firebase/firestore';
import type { JournalEntry, Settings } from '@/lib/types';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';

interface AppState {
  entries: JournalEntry[];
  settings: Settings;
  streak: number;
  weeklyAverageMood: number | null;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'date'>) => Promise<void>;
  updateSettings: (newSettings: Settings) => void;
  deleteAllData: () => Promise<void>;
}

export const AppContext = createContext<AppState | undefined>(undefined);

export const defaultSettings: Settings = {
  theme: 'system',
};

export const useApp = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isStoreLoaded, setIsStoreLoaded] = useState(false);

  // Fetch entries from Firestore when user is logged in
  useEffect(() => {
    if (user) {
      const fetchEntries = async () => {
        try {
          const entriesCollection = collection(db, 'users', user.id, 'entries');
          const q = query(entriesCollection, orderBy('date', 'desc'));
          const querySnapshot = await getDocs(q);
          const userEntries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as JournalEntry[];
          setEntries(userEntries);
        } catch (error) {
          console.error('Failed to fetch entries from Firestore', error);
        }
      };
      fetchEntries();
    } else {
      // Clear entries when user logs out
      setEntries([]);
    }
  }, [user]);

  // Load settings from local storage
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('howzue-settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage', error);
    }
    setIsStoreLoaded(true);
  }, []);

  // Save settings to local storage
  useEffect(() => {
    if (isStoreLoaded) {
      localStorage.setItem('howzue-settings', JSON.stringify(settings));
    }
  }, [settings, isStoreLoaded]);

  const addEntry = useCallback(async (newEntryData: Omit<JournalEntry, 'id' | 'date'>) => {
    if (!user) {
      console.error('User not logged in, cannot add entry');
      return;
    }

    const newEntry: Omit<JournalEntry, 'id'> = {
      ...newEntryData,
      date: new Date().toISOString(),
    };
    
    try {
      const entriesCollection = collection(db, 'users', user.id, 'entries');
      const docRef = await addDoc(entriesCollection, newEntry);
      
      const addedEntry: JournalEntry = {
        id: docRef.id,
        ...newEntry
      }

      setEntries(prevEntries => [addedEntry, ...prevEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }, [user]);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const deleteAllData = useCallback(async () => {
    if (!user) {
      console.error('User not logged in, cannot delete data');
      return;
    }
    try {
      const entriesCollection = collection(db, 'users', user.id, 'entries');
      const querySnapshot = await getDocs(entriesCollection);
      
      const batch = writeBatch(db);
      querySnapshot.forEach(document => {
        batch.delete(doc(db, 'users', user.id, 'entries', document.id));
      });
      
      await batch.commit();
      setEntries([]);
    } catch (error) {
      console.error('Error deleting all documents: ', error);
    }
  }, [user]);
  
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

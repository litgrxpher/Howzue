
'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JournalForm } from './journal-form';
import type { Mood } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import { useAppStore } from '@/hooks/use-app-store';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function MoodSelector() {
  const { addEntry } = useAppStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<Mood | null>(null);

  const handleMoodSelect = async (mood: Mood) => {
    setIsLoading(mood);
    await addEntry({ mood, text: '' });
    toast({
        title: "Mood logged!",
        description: `You're feeling ${mood}.`,
    });
    setIsLoading(null);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 p-2">
      {MOODS.map(({ name, emoji }) => (
        <Button
          key={name}
          variant="outline"
          className="flex-col h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 gap-1 rounded-xl shadow-md transition-all duration-200 hover:shadow-xl hover:scale-105 border-blue-200 hover:border-blue-400 focus:scale-105 focus:shadow-xl focus:border-blue-400 dark:border-blue-800/50 dark:hover:border-blue-700"
          onClick={() => handleMoodSelect(name)}
          disabled={!!isLoading}
        >
          {isLoading === name ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : (
            <>
              <span className="text-4xl sm:text-5xl md:text-6xl">{emoji}</span>
              <span className="text-xs sm:text-sm md:text-base capitalize font-semibold text-muted-foreground">{name}</span>
            </>
          )}
        </Button>
      ))}
    </div>
  );
}

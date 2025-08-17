
'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JournalForm } from './journal-form';
import type { Mood } from '@/lib/types';
import { MOODS } from '@/lib/constants';

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = React.useState<Mood | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 p-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {MOODS.map(({ name, emoji }) => (
          <DialogTrigger asChild key={name}>
            <Button
              variant="outline"
              className="flex-col h-32 w-32 gap-2 rounded-xl shadow-md transition-all duration-200 hover:shadow-xl hover:scale-105 hover:border-primary focus:scale-105 focus:shadow-xl focus:border-primary"
              onClick={() => handleMoodSelect(name)}
            >
              <span className="text-6xl">{emoji}</span>
              <span className="text-base capitalize font-semibold text-muted-foreground">{name}</span>
            </Button>
          </DialogTrigger>
        ))}
        <DialogContent className="sm:max-w-[425px] md:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">New Journal Entry</DialogTitle>
            <DialogDescription>
              You're feeling <span className="font-semibold">{selectedMood}</span>. Tell us more.
            </DialogDescription>
          </DialogHeader>
          <JournalForm
            initialMood={selectedMood}
            onSave={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

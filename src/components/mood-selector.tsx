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
    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {MOODS.map(({ name, emoji }) => (
          <DialogTrigger asChild key={name}>
            <Button
              variant="outline"
              size="lg"
              className="flex-col h-24 w-24 gap-2 rounded-lg transition-all duration-200 hover:bg-accent hover:scale-105"
              onClick={() => handleMoodSelect(name)}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="text-sm capitalize text-muted-foreground">{name}</span>
            </Button>
          </DialogTrigger>
        ))}
        <DialogContent className="sm:max-w-[425px] md:max-w-lg">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
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

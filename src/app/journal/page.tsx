'use client';

import { JournalForm } from '@/components/journal-form';
import { JournalList } from '@/components/journal-list';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/hooks/use-app-store';
import { Book, PenSquare } from 'lucide-react';
import React from 'react';

export default function JournalPage() {
  const { entries } = useAppStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight font-headline">My Journal</h1>
          <p className="text-muted-foreground text-lg">Your personal space to reflect and grow.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-md">
              <PenSquare className="mr-2 h-5 w-5" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">New Journal Entry</DialogTitle>
              <DialogDescription>
                How are you feeling today? Write down your thoughts.
              </DialogDescription>
            </DialogHeader>
            <JournalForm onSave={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {entries.length > 0 ? (
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <JournalList entries={entries} />
        </ScrollArea>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-br from-card to-muted/50 p-8 rounded-lg border-2 border-dashed">
          <Book className="w-20 h-20 text-primary" />
          <h2 className="text-2xl font-semibold">Your journal is empty</h2>
          <p className="text-muted-foreground max-w-sm">
            Start by writing a new entry. It's a great way to understand your feelings better.
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-4 shadow-md">
                <PenSquare className="mr-2 h-5 w-5" />
                Write Your First Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">New Journal Entry</DialogTitle>
                <DialogDescription>
                  How are you feeling today? Write down your thoughts.
                </DialogDescription>
              </DialogHeader>
              <JournalForm onSave={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

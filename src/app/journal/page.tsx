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
          <h1 className="text-3xl font-bold tracking-tight font-headline">My Journal</h1>
          <p className="text-muted-foreground">Your personal space to reflect and grow.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PenSquare className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] md:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Journal Entry</DialogTitle>
              <DialogDescription>
                How are you feeling today? Write down your thoughts.
              </DialogDescription>
            </DialogHeader>
            <JournalForm onSave={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {entries.length > 0 ? (
        <ScrollArea className="flex-grow">
          <JournalList entries={entries} />
        </ScrollArea>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center bg-card p-8 rounded-lg border-2 border-dashed">
          <Book className="w-16 h-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Your journal is empty</h2>
          <p className="text-muted-foreground max-w-sm">
            Start by writing a new entry. It's a great way to understand your feelings better.
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PenSquare className="mr-2 h-4 w-4" />
                Write First Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
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

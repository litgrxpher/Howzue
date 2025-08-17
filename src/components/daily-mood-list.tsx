
'use client';
import { format } from 'date-fns';
import type { JournalEntry } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import { ScrollArea } from './ui/scroll-area';

interface DailyMoodListProps {
  entries: JournalEntry[];
}

export function DailyMoodList({ entries }: DailyMoodListProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <ScrollArea className="h-64 pr-4">
        <div className="space-y-4">
        {sortedEntries.map((entry) => {
            const moodInfo = MOODS.find(m => m.name === entry.mood);
            return (
            <div key={entry.id} className="flex items-center gap-4">
                <span className="text-3xl">{moodInfo?.emoji}</span>
                <div className="flex-grow">
                    <p className="font-semibold capitalize text-base">{moodInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), "h:mm a")}
                    </p>
                </div>
            </div>
            );
        })}
        </div>
    </ScrollArea>
  );
}

'use client';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { JournalEntry } from '@/lib/types';
import { MOODS } from '@/lib/constants';

interface JournalListProps {
  entries: JournalEntry[];
}

export function JournalList({ entries }: JournalListProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-6">
      {sortedEntries.map((entry) => {
        const moodInfo = MOODS.find(m => m.name === entry.mood);
        return (
          <Card key={entry.id} className="shadow-md transition-all duration-300 hover:shadow-xl">
            <CardHeader className="border-b">
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(entry.date), 'p')}
                    </CardDescription>
                  </div>
                  {moodInfo && (
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl">{moodInfo.emoji}</span>
                        <span className="text-xs font-semibold uppercase text-muted-foreground">{moodInfo.name}</span>
                    </div>
                  )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-base text-foreground/80 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

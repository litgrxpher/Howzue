
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
          <Card key={entry.id} className="shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <CardHeader>
                <div className="flex items-center gap-4">
                  {moodInfo && (
                      <span className="text-4xl">{moodInfo.emoji}</span>
                  )}
                  <div>
                      <CardTitle className="text-xl font-bold capitalize">
                      {moodInfo?.name}
                      </CardTitle>
                      <CardDescription>
                          {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                      </CardDescription>
                  </div>
                </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-foreground/80 whitespace-pre-wrap leading-relaxed">{entry.text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

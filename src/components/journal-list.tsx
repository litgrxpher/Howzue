'use client';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import type { JournalEntry } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import Image from 'next/image';

interface JournalListProps {
  entries: JournalEntry[];
}

export function JournalList({ entries }: JournalListProps) {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => {
        const moodInfo = MOODS.find(m => m.name === entry.mood);
        return (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {format(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(entry.date), 'p')}
                    </CardDescription>
                  </div>
                  {moodInfo && <Image src={moodInfo.emoji} alt={moodInfo.name} width={32} height={32} />}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{entry.text}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

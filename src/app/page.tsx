
'use client';

import React from 'react';
import { format } from 'date-fns';
import { Smile, Zap, TrendingUp, CalendarDays, Calendar as CalendarIcon } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoodSelector } from '@/components/mood-selector';
import { useAppStore } from '@/hooks/use-app-store';
import { MOODS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { entries, streak, weeklyAverageMood } = useAppStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  const selectedDateEntry = entries.find(
    (entry) => new Date(entry.date).toDateString() === selectedDate.toDateString()
  );

  const averageMoodEmoji = React.useMemo(() => {
    if (!weeklyAverageMood) return '🤔';
    const closestMood = MOODS.reduce((prev, curr) =>
      Math.abs(curr.value - weeklyAverageMood) < Math.abs(prev.value - weeklyAverageMood)
        ? curr
        : prev
    );
    return closestMood.emoji;
  }, [weeklyAverageMood]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back!</h1>
          <p className="text-muted-foreground">
            {isToday ? "Here's your summary for today" : `Viewing data for ${format(selectedDate, 'EEEE, MMMM d')}`}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              disabled={(date) =>
                date > new Date() || date < new Date('2000-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className="text-3xl">{averageMoodEmoji}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyAverageMood ? `~${weeklyAverageMood.toFixed(1)}/5 mood level` : 'No entries this week'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Journaling Streak</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">journals logged all time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile size={24} />
            {isToday ? "How are you feeling today?" : `On ${format(selectedDate, 'MMMM d')}, you felt...`}
          </CardTitle>
          {selectedDateEntry && isToday && (
             <CardDescription>
              You've already logged your mood today as {selectedDateEntry.mood}. You can update it if you like.
             </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {isToday ? (
            <MoodSelector />
          ) : (
            <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg text-center">
              {selectedDateEntry ? (
                <div>
                  <span className="text-6xl">{MOODS.find(m => m.name === selectedDateEntry.mood)?.emoji}</span>
                  <p className="text-xl font-semibold capitalize mt-2">{selectedDateEntry.mood}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No entry logged on this day.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


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
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight font-headline">Welcome back!</h1>
            <p className="text-muted-foreground text-lg">
              {isToday ? "Here's your summary for today" : `Viewing data for ${format(selectedDate, 'EEEE, MMMM d')}`}
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full sm:w-[280px] justify-start text-left font-normal shadow-sm',
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
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-fade-in-up shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Weekly Average</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">
              {averageMoodEmoji}
            </div>
            <p className="text-xs text-muted-foreground">
              {weeklyAverageMood ? `~${weeklyAverageMood.toFixed(1)}/5 mood level` : 'No entries this week'}
            </p>
          </CardContent>
        </Card>
        <Card className="animate-fade-in-up shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Journaling Streak</CardTitle>
            <Zap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground">Keep the momentum going!</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1 animate-fade-in-up shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Total Entries</CardTitle>
            <CalendarDays className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">journals logged all time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in-up shadow-lg" style={{ animationDelay: '0.4s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Smile size={28} className="text-primary"/>
            <span className="text-2xl">{isToday ? "How are you feeling today?" : `On ${format(selectedDate, 'MMMM d')}, you felt...`}</span>
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
            <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg text-center h-48">
              {selectedDateEntry ? (
                <div>
                  <span className="text-7xl">{MOODS.find(m => m.name === selectedDateEntry.mood)?.emoji}</span>
                  <p className="text-2xl font-semibold capitalize mt-2">{selectedDateEntry.mood}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-lg">No entry logged on this day.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

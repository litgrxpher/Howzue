'use client';

import React from 'react';
import { format } from 'date-fns';
import { Smile, Zap, TrendingUp, CalendarDays } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoodSelector } from '@/components/mood-selector';
import { useAppStore } from '@/hooks/use-app-store';
import { MOODS } from '@/lib/constants';

export default function DashboardPage() {
  const { entries, streak, weeklyAverageMood } = useAppStore();

  const today = format(new Date(), 'EEEE, MMMM d');
  const todayEntry = entries.find(
    (entry) => new Date(entry.date).toDateString() === new Date().toDateString()
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back!</h1>
        <p className="text-muted-foreground">{today}</p>
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
            How are you feeling today?
          </CardTitle>
          {todayEntry && (
             <CardDescription>
              You've already logged your mood today as {todayEntry.mood}. You can update it if you like.
             </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <MoodSelector />
        </CardContent>
      </Card>
    </div>
  );
}

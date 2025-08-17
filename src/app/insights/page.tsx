
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/hooks/use-app-store';
import { BrainCircuit, LineChart, Lightbulb } from 'lucide-react';
import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MoodChart = dynamic(() => import('@/components/mood-chart').then(mod => mod.MoodChart), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full" />,
});

const AiSummary = dynamic(() => import('@/components/ai-summary').then(mod => mod.AiSummary), {
  ssr: false,
  loading: () => <Skeleton className="h-24 w-full" />,
});


export default function InsightsPage() {
  const { entries } = useAppStore();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Insights</h1>
        <p className="text-muted-foreground text-base sm:text-lg">Discover patterns in your emotional landscape.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <LineChart className="text-primary" />
            <span>Mood Trends</span>
          </CardTitle>
          <CardDescription>
            A visual representation of your mood fluctuations over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 5 ? (
            <MoodChart entries={entries} />
          ) : (
            <div className="h-80 flex flex-col items-center justify-center gap-4 text-center bg-gradient-to-br from-card to-muted/50 p-6 sm:p-8 rounded-lg border-2 border-dashed">
              <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 text-primary" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Not enough data yet</h2>
              <p className="text-muted-foreground max-w-sm text-sm sm:text-base">
                Keep logging your mood for at least 5 days to see your trends. Your emotional map will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
            <BrainCircuit className="text-primary" />
            <span>AI-Powered Summary</span>
          </CardTitle>
          <CardDescription>
            An analysis of your recent entries to highlight mood patterns and potential triggers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiSummary entries={entries} />
        </CardContent>
      </Card>
    </div>
  );
}

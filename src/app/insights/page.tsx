'use client';

import { AiSummary } from '@/components/ai-summary';
import { MoodChart } from '@/components/mood-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/hooks/use-app-store';
import { BrainCircuit, LineChart, Lightbulb } from 'lucide-react';
import React from 'react';

export default function InsightsPage() {
  const { entries, settings } = useAppStore();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Insights</h1>
        <p className="text-muted-foreground">Discover patterns in your emotional landscape.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart />
            Mood Trends
          </CardTitle>
          <CardDescription>
            A visual representation of your mood fluctuations over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 5 ? (
            <MoodChart entries={entries} />
          ) : (
            <div className="h-80 flex flex-col items-center justify-center gap-4 text-center bg-muted/50 p-8 rounded-lg">
              <Lightbulb className="w-16 h-16 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Not enough data yet</h2>
              <p className="text-muted-foreground max-w-sm">
                Keep logging your mood for at least 5 days to see your trends.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {settings.enableAiInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit />
              AI-Powered Summary
            </CardTitle>
            <CardDescription>
              An analysis of your recent entries to highlight mood patterns and potential triggers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiSummary entries={entries} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

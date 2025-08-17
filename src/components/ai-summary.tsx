'use client';
import React, { useState, useCallback } from 'react';
import { summarizeMoodPatterns } from '@/ai/flows/summarize-mood-patterns';
import { Button } from './ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { JournalEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AiSummaryProps {
  entries: JournalEntry[];
}

export function AiSummary({ entries }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleGenerateSummary = useCallback(async () => {
    if (entries.length < 3) {
      toast({
        variant: 'destructive',
        title: 'Not enough data',
        description: 'Please add at least 3 journal entries to generate a summary.',
      });
      return;
    }
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeMoodPatterns({
        journalEntries: entries.slice(-10).map(e => ({ // Use last 10 entries
          timestamp: e.date,
          mood: e.mood,
          text: e.text,
        })),
      });
      setSummary(result.summary);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [entries, toast]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Generate Summary
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {summary && (
        <Alert>
          <AlertTitle>Your Mood Summary</AlertTitle>
          <AlertDescription>
            <p className="whitespace-pre-wrap">{summary}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

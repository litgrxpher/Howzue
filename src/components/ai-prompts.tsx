'use client';
import React, { useState, useCallback } from 'react';
import { generateReflectionPrompts } from '@/ai/flows/generate-reflection-prompts';
import { Button } from './ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import type { JournalEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AiPromptsProps {
  entries: JournalEntry[];
  onPromptSelect: (prompt: string) => void;
}

export function AiPrompts({ entries, onPromptSelect }: AiPromptsProps) {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePrompts = useCallback(async () => {
    if (entries.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No entries yet',
        description: 'Write your first journal entry to get personalized prompts.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateReflectionPrompts({
        journalEntries: entries.slice(-5).map(e => e.text), // Use last 5 entries
      });
      setPrompts(result.reflectionPrompts);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate prompts. Please try again.',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [entries, toast]);

  return (
    <div className="space-y-2">
      <Button type="button" variant="ghost" onClick={handleGeneratePrompts} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Need inspiration? Get AI prompts
      </Button>
      {prompts.length > 0 && (
        <div className="space-y-2 pt-2">
            <h4 className="text-sm font-medium">Suggestions:</h4>
          {prompts.map((prompt, index) => (
            <Button
              key={index}
              type="button"
              variant="outline"
              size="sm"
              className="mr-2 mb-2 h-auto whitespace-normal text-left"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

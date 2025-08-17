
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Info, Bot } from 'lucide-react';
import { classifyEntryIntent } from '@/ai/flows/classify-entry-intent';
import { generateAiCompanionResponse } from '@/ai/flows/generate-ai-companion-response';

const companionFormSchema = z.object({
  journalEntry: z.string().min(10, {
    message: 'Please enter at least 10 characters to get a response.',
  }),
});

type CompanionFormValues = z.infer<typeof companionFormSchema>;

export function AiCompanion() {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm<CompanionFormValues>({
    resolver: zodResolver(companionFormSchema),
    defaultValues: {
      journalEntry: '',
    },
  });

  async function onSubmit(data: CompanionFormValues) {
    setIsLoading(true);
    setError('');
    setAiResponse('');

    try {
      const { intent } = await classifyEntryIntent({ journalEntry: data.journalEntry });
      
      if (intent === 'emotional' || intent === 'reflective') {
        const result = await generateAiCompanionResponse({ journalEntry: data.journalEntry });
        setAiResponse(result.aiResponse);
      } else {
        setAiResponse("I am here to support you with your emotional and reflective thoughts. It seems like this entry is about something else. Would you like to write about your feelings?");
      }
    } catch (e) {
      console.error(e);
      setError('Sorry, something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="journalEntry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share what's on your mind</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell me about your feelings, your day, or anything you're reflecting on..."
                    className="resize-y min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get Response
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {aiResponse && (
        <Alert>
          <Bot className="h-4 w-4" />
          <AlertTitle>AI Companion's Response</AlertTitle>
          <AlertDescription>
            <p className="whitespace-pre-wrap">{aiResponse}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg mt-6">
          <Info className="w-5 h-5 mt-1 text-accent-foreground flex-shrink-0" />
          <div>
              <h3 className="font-semibold text-accent-foreground">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                This AI companion is for support and reflection, not a replacement for professional help. If you are in a crisis or feel you are a danger to yourself or others, please contact a crisis hotline or a mental health professional immediately.
              </p>
          </div>
      </div>
    </div>
  );
}

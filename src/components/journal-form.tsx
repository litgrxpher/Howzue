
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/hooks/use-app-store';
import type { Mood } from '@/lib/types';
import { MOODS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

const journalFormSchema = z.object({
  mood: z.enum(['great', 'good', 'okay', 'bad', 'awful'], {
    required_error: 'You need to select a mood.',
  }),
  text: z.string().min(10, {
    message: 'Journal entry must be at least 10 characters.',
  }),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

interface JournalFormProps {
  initialMood?: Mood | null;
  onSave?: () => void;
}

export function JournalForm({ initialMood, onSave }: JournalFormProps) {
  const { addEntry } = useAppStore();
  const { toast } = useToast();

  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      mood: initialMood || undefined,
      text: '',
    },
  });

  function onSubmit(data: JournalFormValues) {
    addEntry(data);
    toast({
        title: "Entry Saved",
        description: "Your journal entry has been successfully saved.",
    });
    onSave?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How are you feeling?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-4"
                >
                  {MOODS.map(({ name, emoji }) => (
                    <FormItem key={name} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={name} className="sr-only" />
                      </FormControl>
                      <FormLabel
                        className={`flex flex-col items-center justify-center p-2 rounded-md border-2 border-muted bg-popover hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                          field.value === name ? 'border-primary' : ''
                        }`}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-xs capitalize">{name}</span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What's on your mind?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your day, your thoughts, your feelings..."
                  className="resize-y min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save your thought!</Button>
      </form>
    </Form>
  );
}

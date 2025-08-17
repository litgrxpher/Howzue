
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-base font-semibold">How are you feeling?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-wrap gap-2 sm:gap-4"
                >
                  {MOODS.map(({ name, emoji }) => (
                    <FormItem key={name} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={name} className="sr-only" />
                      </FormControl>
                      <FormLabel
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 border-muted bg-popover hover:bg-accent/20 hover:text-accent-foreground cursor-pointer transition-all duration-200 w-16 h-16 sm:w-20 sm:h-20 ${
                          field.value === name ? 'border-primary scale-110 shadow-lg' : ''
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl">{emoji}</span>
                        <span className="text-xs sm:text-sm capitalize mt-1">{name}</span>
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
              <FormLabel className="text-base font-semibold">What's on your mind?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your day, your thoughts, your feelings..."
                  className="resize-y min-h-[140px] text-base"
                  {...field}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full shadow-md">Save Your Thought</Button>
      </form>
    </Form>
  );
}

// Summarize mood patterns based on journal entries and mood selections to help users understand their emotional trends.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMoodPatternsInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      timestamp: z.string(),
      mood: z.string(),
      text: z.string(),
    })
  ).describe('An array of journal entries, each with a timestamp, mood, and text content.'),
});

export type SummarizeMoodPatternsInput = z.infer<typeof SummarizeMoodPatternsInputSchema>;

const SummarizeMoodPatternsOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s mood patterns over time, highlighting trends and potential triggers.'),
});

export type SummarizeMoodPatternsOutput = z.infer<typeof SummarizeMoodPatternsOutputSchema>;

export async function summarizeMoodPatterns(input: SummarizeMoodPatternsInput): Promise<SummarizeMoodPatternsOutput> {
  return summarizeMoodPatternsFlow(input);
}

const summarizeMoodPatternsPrompt = ai.definePrompt({
  name: 'summarizeMoodPatternsPrompt',
  input: {
    schema: SummarizeMoodPatternsInputSchema,
  },
  output: {
    schema: SummarizeMoodPatternsOutputSchema,
  },
  prompt: `You are an AI assistant designed to help users understand their mood patterns based on their journal entries.

  Analyze the following journal entries and mood selections to identify trends, potential triggers, and overall emotional patterns.

  Journal Entries:
  {{#each journalEntries}}
  - Timestamp: {{timestamp}}, Mood: {{mood}}, Text: {{text}}
  {{/each}}

  Provide a concise summary of the user's mood patterns over time, highlighting any significant trends or potential triggers.
  Make sure to point out any specific text that might indicate triggers.
  Focus on emotional and reflective topics.  Do not respond to other topics.
  If there are not enough journal entries to determine any patterns, respond that there is not enough data to provide a summary.
  `,
});

const summarizeMoodPatternsFlow = ai.defineFlow(
  {
    name: 'summarizeMoodPatternsFlow',
    inputSchema: SummarizeMoodPatternsInputSchema,
    outputSchema: SummarizeMoodPatternsOutputSchema,
  },
  async input => {
    const {output} = await summarizeMoodPatternsPrompt(input);
    return output!;
  }
);

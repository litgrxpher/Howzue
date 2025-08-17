// Generate mood insights based on trends in mood and journal entries.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMoodInsightsInputSchema = z.object({
  journalEntries: z.array(
    z.object({
      timestamp: z.string(),
      mood: z.string(),
      text: z.string(),
    })
  ).describe('An array of journal entries, each with a timestamp, mood, and text content.'),
});

export type GenerateMoodInsightsInput = z.infer<typeof GenerateMoodInsightsInputSchema>;

const GenerateMoodInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights based on the user\'s mood and journal entries.'),
});

export type GenerateMoodInsightsOutput = z.infer<typeof GenerateMoodInsightsOutputSchema>;

export async function generateMoodInsights(input: GenerateMoodInsightsInput): Promise<GenerateMoodInsightsOutput> {
  return generateMoodInsightsFlow(input);
}

const generateMoodInsightsPrompt = ai.definePrompt({
  name: 'generateMoodInsightsPrompt',
  input: {
    schema: GenerateMoodInsightsInputSchema,
  },
  output: {
    schema: GenerateMoodInsightsOutputSchema,
  },
  prompt: `You are an AI assistant designed to provide insights based on a user\'s mood and journal entries.

  Analyze the following journal entries and mood selections to identify trends, potential triggers, and overall emotional patterns.

  Journal Entries:
  {{#each journalEntries}}
  - Timestamp: {{timestamp}}, Mood: {{mood}}, Text: {{text}}
  {{/each}}

  Provide concise and helpful insights based on the user\'s mood and journal entries. Focus on identifying potential triggers, trends, and patterns in their emotional state.
  Be specific and reference parts of the journal entries that indicate triggers.
  If there are not enough journal entries to determine any patterns, respond that there is not enough data to provide any insights.
  `,
});

const generateMoodInsightsFlow = ai.defineFlow(
  {
    name: 'generateMoodInsightsFlow',
    inputSchema: GenerateMoodInsightsInputSchema,
    outputSchema: GenerateMoodInsightsOutputSchema,
  },
  async input => {
    const {output} = await generateMoodInsightsPrompt(input);
    return output!;
  }
);

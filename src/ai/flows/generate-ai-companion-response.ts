
'use server';

/**
 * @fileOverview This file contains a Genkit flow that generates AI companion responses to user journal entries.
 *
 * - generateAiCompanionResponse - A function that generates an AI companion response.
 * - GenerateAiCompanionResponseInput - The input type for the generateAiCompanionResponse function.
 * - GenerateAiCompanionResponseOutput - The return type for the generateAiCompanionResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiCompanionResponseInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  message: z.string().describe('The user\'s latest message.'),
});

export type GenerateAiCompanionResponseInput = z.infer<typeof GenerateAiCompanionResponseInputSchema>;

const GenerateAiCompanionResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI companion response to the journal entry.'),
});

export type GenerateAiCompanionResponseOutput = z.infer<typeof GenerateAiCompanionResponseOutputSchema>;

export async function generateAiCompanionResponse(input: GenerateAiCompanionResponseInput): Promise<GenerateAiCompanionResponseOutput> {
  return generateAiCompanionResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiCompanionResponsePrompt',
  input: {schema: GenerateAiCompanionResponseInputSchema},
  output: {schema: GenerateAiCompanionResponseOutputSchema},
  prompt: `You are an AI companion designed to provide thoughtful and supportive responses to a user about their feelings.

  Your goal is to help the user gain a deeper understanding of their emotions through empathetic conversation.

  - Only respond to emotional or reflective topics.
  - If the conversation turns to non-emotional topics, gently guide it back by asking about their feelings or responding that you are here to talk about their emotional well-being.
  - If the user expresses thoughts of self-harm or harm to others, you MUST respond with: "It sounds like you are going through a difficult time. Please consider reaching out to a crisis hotline or a mental health professional. They are equipped to provide the support you need."

  Conversation History:
  {{#each history}}
  {{#if (eq role 'user')}}User: {{content}}{{/if}}
  {{#if (eq role 'model')}}AI: {{content}}{{/if}}
  {{/each}}

  New User Message: {{message}}

  AI Companion Response:`,
});

const generateAiCompanionResponseFlow = ai.defineFlow(
  {
    name: 'generateAiCompanionResponseFlow',
    inputSchema: GenerateAiCompanionResponseInputSchema,
    outputSchema: GenerateAiCompanionResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


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
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
      })
    )
    .describe('The conversation history.'),
  message: z.string().describe("The user's latest message."),
});

export type GenerateAiCompanionResponseInput = z.infer<typeof GenerateAiCompanionResponseInputSchema>;

const GenerateAiCompanionResponseOutputSchema = z.object({
  aiResponse: z.string().describe('The AI companion response to the journal entry.'),
});

export type GenerateAiCompanionResponseOutput = z.infer<typeof GenerateAiCompanionResponseOutputSchema>;

export async function generateAiCompanionResponse(
  input: GenerateAiCompanionResponseInput
): Promise<GenerateAiCompanionResponseOutput> {
  return generateAiCompanionResponseFlow(input);
}

const systemPrompt = `You are an AI companion designed to provide thoughtful and supportive responses to a user about their feelings.

Your goal is to help the user gain a deeper understanding of their emotions through empathetic conversation.

- Only respond to emotional or reflective topics.
- If the conversation turns to non-emotional topics, you must gently guide it back by asking about their feelings or responding with a supportive statement like: "I'm here to talk about your feelings. How are you doing emotionally?" or "That's interesting, but I'd like to focus on you. How have you been feeling lately?". Do not answer off-topic questions.
- If the user expresses thoughts of self-harm or harm to others, you MUST respond with: "It sounds like you are going through a difficult time. Please consider reaching out to a crisis hotline or a mental health professional. They are equipped to provide the support you need."`;

const generateAiCompanionResponseFlow = ai.defineFlow(
  {
    name: 'generateAiCompanionResponseFlow',
    inputSchema: GenerateAiCompanionResponseInputSchema,
    outputSchema: GenerateAiCompanionResponseOutputSchema,
  },
  async input => {
    const {history, message} = input;
    
    const {text} = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      history: [
        ...history,
        { role: 'user', content: message }
      ],
      config: {
        systemPrompt: systemPrompt,
      },
    });

    return {
      aiResponse: text,
    };
  }
);

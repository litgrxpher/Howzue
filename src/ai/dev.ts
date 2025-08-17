import { config } from 'dotenv';
config();

import '@/ai/flows/generate-reflection-prompts.ts';
import '@/ai/flows/summarize-mood-patterns.ts';
import '@/ai/flows/generate-mood-insights.ts';
import '@/ai/flows/generate-ai-companion-response.ts';
import '@/ai/flows/classify-entry-intent.ts';
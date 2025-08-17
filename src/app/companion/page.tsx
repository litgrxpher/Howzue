
'use client';

import { AiCompanion } from '@/components/ai-companion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function CompanionPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">AI Companion</h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Chat with your AI companion for support and reflection.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Bot />
            Your Conversation
          </CardTitle>
          <CardDescription>
            Share your thoughts or feelings to get a supportive response. Your conversation is private and not saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AiCompanion />
        </CardContent>
      </Card>
    </div>
  );
}

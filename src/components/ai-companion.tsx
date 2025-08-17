
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Info, Bot, User } from 'lucide-react';
import { generateAiCompanionResponse } from '@/ai/flows/generate-ai-companion-response';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const companionFormSchema = z.object({
  message: z.string().min(1, {
    message: 'Message cannot be empty.',
  }),
});

type CompanionFormValues = z.infer<typeof companionFormSchema>;

export function AiCompanion() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Hello! How are you feeling today? You can share your thoughts with me." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<CompanionFormValues>({
    resolver: zodResolver(companionFormSchema),
    defaultValues: {
      message: '',
    },
  });
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(data: CompanionFormValues) {
    setIsLoading(true);
    setError('');

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: data.message }];
    setMessages(newMessages);
    form.reset();

    try {
        const result = await generateAiCompanionResponse({ 
            history: messages,
            message: data.message 
        });
        setMessages([...newMessages, { role: 'model', content: result.aiResponse }]);
    } catch (e) {
      console.error(e);
      setError('Sorry, something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[65vh] sm:h-[60vh]">
      <ScrollArea className="flex-grow p-4 border rounded-lg mb-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'model' && (
                <div className="p-2 bg-muted rounded-full">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-xs sm:max-w-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                 <div className="p-2 bg-muted rounded-full">
                    <User className="w-5 h-5 text-foreground" />
                </div>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="p-2 bg-muted rounded-full">
                  <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="p-3 rounded-lg bg-muted">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input placeholder="Share what's on your mind..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Send
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-start gap-2 sm:gap-4 p-3 sm:p-4 bg-accent/50 rounded-lg mt-6">
          <Info className="w-6 h-6 sm:w-5 sm:h-5 mt-1 text-accent-foreground flex-shrink-0" />
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

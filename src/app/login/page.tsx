
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/logo';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

type FormValues = z.infer<typeof formSchema>;

function AuthForm({ type, onAuth }: { type: 'login' | 'signup'; onAuth: () => void }) {
    const { login, signup } = useAuth();
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', password: '' },
    });

    const handleSubmit = (data: FormValues) => {
        if (type === 'login') {
            login(data.email);
        } else {
            signup(data.email);
        }
        onAuth();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full">
                {type === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
            </form>
        </Form>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { user } = useAuth();

    React.useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleAuthSuccess = () => {
        router.push('/');
    };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
        <Logo />
      </div>
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to continue to your journal.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm type="login" onAuth={handleAuthSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>Get started with your personal mood journal.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuthForm type="signup" onAuth={handleAuthSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

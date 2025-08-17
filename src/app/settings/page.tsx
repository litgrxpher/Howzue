
'use client';
import { useAppStore } from '@/hooks/use-app-store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Theme } from '@/lib/types';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { settings, updateSettings, deleteAllData } = useAppStore();
  const { toast } = useToast();

  const handleAiToggle = (checked: boolean) => {
    updateSettings({ ...settings, enableAiInsights: checked });
  };

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ ...settings, theme });
  };

  const handleDeleteData = () => {
    deleteAllData();
    toast({
      title: 'Data Deleted',
      description: 'All your journal entries have been deleted.',
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your Howzue experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="ai-insights" className="flex flex-col space-y-1">
              <span>Enable AI Insights</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get AI-powered summaries and reflection prompts.
              </span>
            </Label>
            <Switch
              id="ai-insights"
              checked={settings.enableAiInsights}
              onCheckedChange={handleAiToggle}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="theme" className="flex flex-col space-y-1">
              <span>Theme</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Choose how Howzue looks on your device.
              </span>
            </Label>
            <Select onValueChange={handleThemeChange} defaultValue={settings.theme}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg">
                <Info className="w-5 h-5 mt-1 text-accent-foreground" />
                <div>
                    <h3 className="font-semibold text-accent-foreground">Your Data is Yours</h3>
                    <p className="text-sm text-muted-foreground">
                    All your journal entries and mood data are stored locally on your device's browser. We do not collect or store your personal data on our servers. When you use AI features, anonymized text may be sent to our AI provider to generate insights.
                    </p>
                </div>
            </div>
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete All Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your journal entries from this device's browser.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteData}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

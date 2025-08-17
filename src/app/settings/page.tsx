
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Theme } from '@/lib/types';
import { Info, LogOut, Trash2 } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { settings, updateSettings, deleteAllData } = useAppStore();
  const { logout, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleThemeChange = (theme: Theme) => {
    updateSettings({ ...settings, theme });
  };

  const handleDeleteData = async () => {
    await deleteAllData();
    toast({
      title: 'Data Deleted',
      description: 'All your journal entries have been deleted from this device.',
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground text-base sm:text-lg">Manage your app preferences and account.</p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Preferences</CardTitle>
          <CardDescription>Customize your Howzue experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <Label htmlFor="theme" className="flex flex-col space-y-1">
              <span className="text-base">Theme</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Choose how Howzue looks on your device.
              </span>
            </Label>
            <Select onValueChange={handleThemeChange} defaultValue={settings.theme}>
              <SelectTrigger className="w-full sm:w-[180px] shadow-sm">
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

      <Card className="shadow-lg border-destructive/50">
        <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Account & Data</CardTitle>
            {user?.email && (
              <CardDescription>You are logged in as {user.email}.</CardDescription>
            )}
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800/50">
                <Info className="w-5 h-5 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300">Your Data is Stored Locally</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400/80">
                    All your journal entries and mood data are stored securely in your browser's local storage. Your data does not leave your device. When you use AI features, anonymized text may be sent to our AI provider to generate insights.
                    </p>
                </div>
            </div>
        </CardContent>
        <CardFooter className="bg-muted/50 py-4 px-6 rounded-b-lg flex flex-col sm:flex-row sm:justify-start gap-2">
          <Button onClick={handleLogout} variant="outline" className="shadow-md w-full sm:w-auto">
              <LogOut className="mr-2" />
              Logout
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="shadow-md w-full sm:w-auto">
                <Trash2 className="mr-2" />
                Delete All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your journal entries from this device.
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

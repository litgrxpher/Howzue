import { Activity } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';

// Helper to safely use a hook that might not be in a provider
function useSafeSidebar() {
  try {
    return useSidebar();
  } catch (e) {
    // If useSidebar throws, it means we're not in a SidebarProvider.
    // Return a default state that makes sense for components outside the main app shell.
    return { isCollapsed: false };
  }
}


export function Logo() {
  const { isCollapsed } = useSafeSidebar();
  return (
    <div className={cn("flex items-center gap-2 p-2", isCollapsed && "justify-center")}>
      <Activity className="h-6 w-6 text-primary" />
      <h1 className={cn("text-xl font-bold font-headline text-foreground", isCollapsed && "hidden")}>Howzue</h1>
    </div>
  );
}

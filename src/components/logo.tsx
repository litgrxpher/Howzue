import { Activity } from 'lucide-react';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';

export function Logo() {
  const { isCollapsed } = useSidebar();
  return (
    <div className={cn("flex items-center gap-2 p-2", isCollapsed && "justify-center")}>
      <Activity className="h-6 w-6 text-primary" />
      <h1 className={cn("text-xl font-bold font-headline text-foreground", isCollapsed && "hidden")}>Howzue</h1>
    </div>
  );
}


// src/components/ui/Topbar.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar';
import { Button } from './button';
import { PanelLeft } from 'lucide-react';

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  pageTitle: string;
  breadcrumbs?: React.ReactNode; // Placeholder for breadcrumbs
  actions?: React.ReactNode; // Placeholder for actions (e.g., user menu, notifications)
}

export const Topbar = React.forwardRef<HTMLDivElement, TopbarProps>(
  ({ className, pageTitle, breadcrumbs, actions, ...props }, ref) => {
    const { setOpenMobile } = useSidebar();

    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6",
          className
        )}
        {...props}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 md:hidden"
          onClick={() => setOpenMobile(true)}
          aria-label="Open sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold flex-1">{pageTitle}</h1>
        {breadcrumbs && <div className="hidden md:block text-sm text-muted-foreground">{breadcrumbs}</div>}
        <div className="ml-auto flex items-center gap-4">
          {actions}
        </div>
      </header>
    );
  }
);
Topbar.displayName = "Topbar";

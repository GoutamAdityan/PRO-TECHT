import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex-1 min-w-[200px]", wrapperClassName)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          className={cn(
            "pl-9 h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;

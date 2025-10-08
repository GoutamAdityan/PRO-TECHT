import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  kpi: string;
  kpiLabel: string;
  href: string;
  colorClassName: string;
}

export const DashboardCard = ({
  title,
  description,
  icon: Icon,
  kpi,
  kpiLabel,
  href,
  colorClassName,
}: DashboardCardProps) => {
  return (
    <Link to={href} className="block hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      <Card className={cn(
        "h-full overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl dark:hover:shadow-lg border-2",
        "border-transparent hover:border-primary/20 dark:hover:shadow-primary/10",
        colorClassName
      )}>
        <CardHeader className="pb-4">
          <div className="mb-4 w-16 h-16 rounded-2xl flex items-center justify-center bg-background/50 dark:bg-background/80 shadow-inner-lg">
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <div className="text-left">
            <p className="text-3xl font-bold">{kpi}</p>
            <p className="text-xs text-muted-foreground">{kpiLabel}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

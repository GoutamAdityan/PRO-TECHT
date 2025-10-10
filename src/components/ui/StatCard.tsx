
// src/components/ui/StatCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card'; // Assuming Card component exists
import { cn } from '@/lib/utils';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  sparkline?: React.ReactNode; // Placeholder for mini charts/sparklines
}

export const StatCard: React.FC<StatCardProps> = ({
  title, value, description, icon, sparkline, className, ...props
}) => {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {sparkline && <div className="mt-4">{sparkline}</div>}
      </CardContent>
    </Card>
  );
};

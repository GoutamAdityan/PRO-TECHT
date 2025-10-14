import React from 'react';
import { cn } from '@/lib/utils';

export type JobStatus = "Pending" | "In Progress" | "Completed" | "Unread" | "Approved" | "Rejected";

interface StatusBadgeProps {
  status: JobStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusClasses = {
    'Pending': 'bg-amber-500/20 text-amber-400',
    'In Progress': 'bg-blue-500/20 text-blue-400',
    'Completed': 'bg-emerald-500/20 text-emerald-400',
    'Unread': 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusClasses[status])}>
      {status}
    </span>
  );
};

export default StatusBadge;

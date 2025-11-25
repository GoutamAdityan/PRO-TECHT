import React from 'react';

// Updated to match database enum: 'submitted', 'assigned', 'in_progress', 'completed', 'cancelled'
export type JobStatus = "submitted" | "assigned" | "in_progress" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: JobStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'submitted':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'assigned':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getDisplayText = () => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'assigned':
        return 'Assigned';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles()}`}>
      {getDisplayText()}
    </span>
  );
};

export default StatusBadge;

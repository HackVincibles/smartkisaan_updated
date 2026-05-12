import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      active: { color: 'green', label: 'Active' },
      pending: { color: 'yellow', label: 'Pending' },
      completed: { color: 'blue', label: 'Completed' },
      cancelled: { color: 'red', label: 'Cancelled' },
      'in-transit': { color: 'purple', label: 'In Transit' },
      delivered: { color: 'green', label: 'Delivered' },
      disputed: { color: 'orange', label: 'Disputed' },
      verified: { color: 'green', label: 'Verified' },
      unverified: { color: 'red', label: 'Unverified' },
      'under-review': { color: 'yellow', label: 'Under Review' },
      'on-hold': { color: 'orange', label: 'On Hold' }
    };
    return configs[status?.toLowerCase()] || { color: 'gray', label: status || 'Unknown' };
  };

  const config = getStatusConfig(status);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${colorClasses[config.color]}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;

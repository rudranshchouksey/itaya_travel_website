import React from 'react';

export const Card = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`rounded-lg border border-border bg-surface text-foreground shadow-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

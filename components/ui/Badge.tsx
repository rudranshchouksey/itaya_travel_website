import React from 'react';

export const Badge = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={`inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>
      {children}
    </span>
  );
};

import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full bg-muted"></div>
      <div className="p-4">
        <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-muted rounded mb-4"></div>
        <div className="h-5 w-1/3 bg-muted rounded"></div>
      </div>
    </div>
  );
};

import React from 'react';

export const PageContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`container mx-auto px-4 py-8 md:py-12 ${className}`}>{children}</div>;
};

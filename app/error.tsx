'use client';

import { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <PageContainer className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-lg mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground mb-8">
            We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => reset()}>Try again</Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>Go Home</Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

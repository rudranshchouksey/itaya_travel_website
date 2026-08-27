import React from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { generateStandardMetadata } from '@/lib/seo/utils';

export const metadata = generateStandardMetadata({
  title: 'Travel Guides | Itvaya',
  description: 'Explore our expert travel guides, itineraries, and tips for your next premium journey.',
  path: '/travel-guides',
});

export default function TravelGuidesIndex() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <PageContainer className="py-12 md:py-16 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Travel Guides</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Expert itineraries, insider tips, and inspiration for your next journey are coming soon.
        </p>
        <div className="p-8 border border-border rounded-xl bg-surface shadow-sm inline-block">
          <p className="text-muted">No guides available at the moment.</p>
        </div>
      </PageContainer>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { DestinationSummary } from '@/lib/api/destinations';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { Grid } from '@/components/layout/Grid';

export const DestinationsSection = ({ destinations }: { destinations: DestinationSummary[] }) => {
  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">Popular Destinations</h2>
          <p className="mt-2 text-muted">Explore our most sought-after locations</p>
        </div>
        <Link href="/destinations" className="hidden text-sm font-semibold text-primary hover:underline md:block">
          View all destinations
        </Link>
      </div>
      <Grid className="lg:grid-cols-4 xl:grid-cols-4">
        {destinations.slice(0, 4).map((dest) => (
          <DestinationCard key={dest.id} destination={dest} />
        ))}
      </Grid>
      <div className="mt-8 text-center md:hidden">
        <Link href="/destinations" className="text-sm font-semibold text-primary hover:underline">
          View all destinations
        </Link>
      </div>
    </div>
  );
};

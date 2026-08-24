import React from 'react';
import Link from 'next/link';
import { ListingSummary } from '@/lib/api/listings';
import { ListingCard } from '@/components/cards/ListingCard';
import { Grid } from '@/components/layout/Grid';

export const TrendingStaysSection = ({ listings }: { listings: ListingSummary[] }) => {
  if (!listings || listings.length === 0) return null;

  return (
    <div className="py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">Trending Stays</h2>
          <p className="mt-2 text-muted">Discover top-rated properties handpicked for you</p>
        </div>
        <Link href="/listings" className="hidden text-sm font-semibold text-primary hover:underline md:block">
          Explore all stays
        </Link>
      </div>
      <Grid className="lg:grid-cols-4 xl:grid-cols-4">
        {listings.slice(0, 4).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </Grid>
      <div className="mt-8 text-center md:hidden">
        <Link href="/listings" className="text-sm font-semibold text-primary hover:underline">
          Explore all stays
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DestinationSummary } from '@/lib/api/destinations';

export const DestinationCard = ({ destination }: { destination: DestinationSummary }) => {
  return (
    <Link href={`/destinations/${destination.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {destination.hero_image_url ? (
          <Image
            src={destination.hero_image_url}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted">No Image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{destination.name}</h3>
        <p className="text-sm text-muted">{destination.country}</p>
      </div>
    </Link>
  );
};

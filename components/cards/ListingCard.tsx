import React from 'react';
import Link from 'next/link';
import { type ListingSummaryUI } from '@/lib/api/listings';

export const ListingCard = ({ listing }: { listing: ListingSummaryUI }) => {
  // Gracefully handle image fallback depending on what backend returns
  const imageUrl = listing.thumbnail_url || (listing.images && listing.images.length > 0 ? listing.images[0].url : null);
  const displayName = (listing as any).name || listing.title;
  const displayPrice = listing.base_price_per_night || 150; // Mock base price if not in DB

  return (
    <Link href={`/listings/${listing.slug}`} className="group block overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted">No Image</div>
        )}
        <div className="absolute top-3 right-3 rounded-full bg-surface/80 p-1.5 backdrop-blur-sm text-muted hover:text-error transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">{displayName}</h3>
          {listing.average_rating && (
            <div className="flex items-center gap-1 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {listing.average_rating}
            </div>
          )}
        </div>
        <p className="text-sm text-muted mb-2">{listing.property_type}</p>
        <div className="font-semibold text-foreground">
          ${displayPrice} <span className="text-sm font-normal text-muted">/ night</span>
        </div>
      </div>
    </Link>
  );
};

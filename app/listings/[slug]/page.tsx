import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { getListingBySlug } from '@/lib/api/listings';
import { ImageGallery } from '@/components/listings/ImageGallery';
import { BookingCard } from '@/components/listings/BookingCard';

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  let listing;
  try {
    listing = await getListingBySlug(params.slug);
  } catch {
    notFound();
  }

  // Gracefully fallback name/base_price if backend doesn't explicitly return them yet.
  const displayName = (listing as any).name || listing.title;
  const displayPrice = listing.base_price_per_night || 150;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Header />
      
      <PageContainer className="pt-6">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{displayName}</h1>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            {listing.average_rating && (
              <span className="flex items-center gap-1 text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                {listing.average_rating} · {listing.total_reviews} reviews
              </span>
            )}
            {listing.address && (
              <span className="underline decoration-muted hover:text-foreground transition-colors cursor-pointer">
                {listing.address}
              </span>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery images={listing.images || []} />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Details */}
          <div className="flex-1 lg:w-2/3">
            <div className="border-b border-border pb-6 mb-6">
              <h2 className="text-2xl font-semibold mb-2">{listing.property_type} hosted by Host</h2>
              <p className="text-muted">
                {listing.guest_capacity} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
              </p>
            </div>

            <div className="border-b border-border pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">About this space</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description || "No description provided."}
              </p>
            </div>

            <div className="border-b border-border pb-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
              {listing.amenities && listing.amenities.length > 0 ? (
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  {listing.amenities.map(amenity => (
                    <div key={amenity.id} className="flex items-center gap-3 text-foreground">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center shrink-0">
                        {/* Placeholder for icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      </div>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Amenities not specified.</p>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Policies</h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Check-in after 3:00 PM</li>
                <li>Checkout before 11:00 AM</li>
                <li>No smoking</li>
                <li>Pets allowed (subject to fee)</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="w-full lg:w-1/3">
            <BookingCard 
              listingId={listing.id} 
              basePrice={typeof displayPrice === 'string' ? parseFloat(displayPrice) : displayPrice} 
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

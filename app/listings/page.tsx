import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { ListingFilters } from '@/components/listings/ListingFilters';
import { getListings, type ListingSummaryUI } from '@/lib/api/listings';
import { ListingCard } from '@/components/cards/ListingCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function ListingsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  // Parse params
  const destination_id = typeof searchParams.destination_id === 'string' ? searchParams.destination_id : undefined;
  const property_type = typeof searchParams.property_type === 'string' ? searchParams.property_type : undefined;
  const guest_capacity = typeof searchParams.guest_capacity === 'string' ? parseInt(searchParams.guest_capacity, 10) : undefined;
  const skip = typeof searchParams.skip === 'string' ? parseInt(searchParams.skip, 10) : 0;
  const limit = 20;

  let listings: ListingSummaryUI[] = [];
  try {
    listings = await getListings({ destination_id, property_type, guest_capacity, skip, limit });
  } catch (error) {
    console.error("Error fetching listings:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="border-b border-border bg-surface py-6">
        <PageContainer>
          <h1 className="font-display text-4xl font-bold">Stays & Accommodations</h1>
          <p className="text-muted mt-2 text-lg">Find the perfect place to stay for your next adventure.</p>
        </PageContainer>
      </div>

      <PageContainer className="py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-2xl"></div>}>
                <ListingFilters />
              </Suspense>
            </div>
          </aside>

          {/* Listing Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {listings.length} {listings.length === 1 ? 'stay' : 'stays'} found
              </h2>
            </div>

            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listings.map((listing, idx) => (
                    <ListingCard key={`${listing.id}-${idx}`} listing={listing} />
                  ))}
                </div>
                
                {/* Pagination (Simplified) */}
                {listings.length === limit && (
                  <div className="mt-12 text-center">
                    <Button variant="outline">Load more stays</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                <h3 className="text-xl font-semibold mb-2">No stays found</h3>
                <p className="text-muted mb-6">Try adjusting your filters to see more results.</p>
                <Link href="/listings" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                  Clear all filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </div>
  );
}

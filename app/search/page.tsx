import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchInputBar } from '@/components/search/SearchInputBar';
import { unifiedSearch, type SearchParams } from '@/lib/api/search';
import { ListingCard } from '@/components/cards/ListingCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { type ListingSummary } from '@/lib/api/listings';
import { type ExperienceSummary } from '@/lib/api/experiences';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  const queryParams: SearchParams = {
    query: typeof searchParams.query === 'string' ? searchParams.query : undefined,
    destination_id: typeof searchParams.destination_id === 'string' ? searchParams.destination_id : undefined,
    type: (typeof searchParams.type === 'string' && ['listing', 'experience', 'all'].includes(searchParams.type)) ? (searchParams.type as "listing" | "experience" | "all") : 'all',
    min_price: typeof searchParams.min_price === 'string' ? parseFloat(searchParams.min_price) : undefined,
    max_price: typeof searchParams.max_price === 'string' ? parseFloat(searchParams.max_price) : undefined,
    sort_by: (typeof searchParams.sort_by === 'string' && ['price_asc', 'price_desc', 'newest', 'relevance'].includes(searchParams.sort_by)) ? (searchParams.sort_by as "price_asc" | "price_desc" | "newest" | "relevance") : 'relevance',
    skip: typeof searchParams.skip === 'string' ? parseInt(searchParams.skip, 10) : 0,
    limit: 20
  };

  let searchResults = null;
  
  try {
    searchResults = await unifiedSearch(queryParams);
  } catch (error) {
    console.error("Error fetching search results:", error);
  }

  const results = searchResults?.results || [];
  const totalCount = searchResults?.total_count || 0;
  const hasMore = (queryParams.skip || 0) + (queryParams.limit || 20) < totalCount;

  return (
    <>
      <Header />
      <div className="border-b border-border bg-surface py-4 sticky top-16 z-40">
        <PageContainer>
          <Suspense fallback={<div className="h-10 w-full max-w-2xl bg-muted animate-pulse rounded-full"></div>}>
            <SearchInputBar initialQuery={queryParams.query} />
          </Suspense>
        </PageContainer>
      </div>

      <PageContainer className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-40">
              <Suspense fallback={<div className="h-64 w-full bg-muted animate-pulse rounded-xl"></div>}>
                <SearchFilters />
              </Suspense>
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold font-display">
                {totalCount} {totalCount === 1 ? 'Result' : 'Results'} found
              </h1>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((item, idx) => {
                  if (item.item_type === 'listing') {
                    return <ListingCard key={`${item.item_id}-${idx}`} listing={item.data as ListingSummary} />;
                  } else if (item.item_type === 'experience') {
                    return (
                      <div key={`${item.item_id}-${idx}`} className="col-span-1 md:col-span-2 xl:col-span-3">
                        <ExperienceCard experience={item.data as ExperienceSummary} />
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-border rounded-2xl bg-muted/30">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted mb-6">Try adjusting your filters or searching for something else.</p>
                <Link href="/search" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            {totalCount > 0 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" disabled={(queryParams.skip || 0) === 0}>Previous</Button>
                <Button variant="outline" disabled={!hasMore}>Next</Button>
              </div>
            )}
          </main>
        </div>
      </PageContainer>
    </>
  );
}

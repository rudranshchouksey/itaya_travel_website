import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { ExperienceFilters } from '@/components/experiences/ExperienceFilters';
import { getExperiences, type ExperienceSummaryUI } from '@/lib/api/experiences';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default async function ExperiencesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  
  // Parse params
  const destination_id = typeof searchParams.destination_id === 'string' ? searchParams.destination_id : undefined;
  const category_id = typeof searchParams.category_id === 'string' ? searchParams.category_id : undefined;
  const max_price = typeof searchParams.max_price === 'string' ? parseFloat(searchParams.max_price) : undefined;
  const skip = typeof searchParams.skip === 'string' ? parseInt(searchParams.skip, 10) : 0;
  const limit = 20;

  let experiences: ExperienceSummaryUI[] = [];
  try {
    experiences = await getExperiences({ destination_id, category_id, max_price, skip, limit });
  } catch (error) {
    console.error("Error fetching experiences:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="border-b border-border bg-surface py-8">
        <PageContainer>
          <h1 className="font-display text-4xl md:text-5xl font-bold">Unforgettable Experiences</h1>
          <p className="text-muted mt-3 text-lg max-w-2xl">Discover local culture, nature, and adventure with expertly curated activities.</p>
        </PageContainer>
      </div>

      <PageContainer className="py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-2xl"></div>}>
                <ExperienceFilters />
              </Suspense>
            </div>
          </aside>

          {/* Experience Grid */}
          <main className="flex-1">
            <div className="mb-6 flex justify-between items-center border-b border-border pb-4">
              <h2 className="text-xl font-semibold">
                {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'} found
              </h2>
            </div>

            {experiences.length > 0 ? (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {experiences.map((exp, idx) => (
                    <ExperienceCard key={`${exp.id}-${idx}`} experience={exp} />
                  ))}
                </div>
                
                {/* Pagination (Simplified) */}
                {experiences.length === limit && (
                  <div className="mt-12 text-center">
                    <Button variant="outline">Load more experiences</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-24 text-center border border-dashed border-border rounded-2xl bg-muted/20">
                <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
                <p className="text-muted mb-8">Try adjusting your filters to see more incredible activities.</p>
                <Link href="/experiences" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
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

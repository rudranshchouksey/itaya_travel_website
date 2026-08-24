import React from 'react';
import { getDestinations, type DestinationSummary } from '@/lib/api/destinations';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { Grid } from '@/components/layout/Grid';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';

// Next.js searchParams are available as a prop in page components
export default async function DestinationsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page, 10) : 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  let destinations: DestinationSummary[] = [];
  try {
    destinations = await getDestinations({ skip, limit });
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }

  return (
    <>
      <Header />
      <PageContainer className="py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground">Explore Destinations</h1>
          <p className="mt-2 text-lg text-muted">Find your next perfect getaway anywhere in the world.</p>
        </div>

        {destinations.length > 0 ? (
          <>
            <Grid className="lg:grid-cols-4 xl:grid-cols-4">
              {destinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </Grid>
            <div className="mt-12 flex justify-center gap-2">
              <Button variant="outline" disabled={page <= 1}>Previous</Button>
              <Button variant="outline" disabled={destinations.length < limit}>Next</Button>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
            <p className="text-muted">We couldn&apos;t find any destinations matching your criteria.</p>
          </div>
        )}
      </PageContainer>
    </>
  );
}

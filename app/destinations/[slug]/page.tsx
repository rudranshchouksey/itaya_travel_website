import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDestinationBySlug } from '@/lib/api/destinations';
import { getListings, type ListingSummary } from '@/lib/api/listings';
import { getExperiences, type ExperienceSummary } from '@/lib/api/experiences';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Grid } from '@/components/layout/Grid';
import { ListingCard } from '@/components/cards/ListingCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateStandardMetadata, getAbsoluteUrl } from '@/lib/seo/utils';
import { TouristDestinationSchema } from '@/components/seo/TouristDestinationSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const destination = await getDestinationBySlug(resolvedParams.slug);
    const description = destination.short_description || `Discover ${destination.name}, ${destination.country}`;

    return generateStandardMetadata({
      title: `${destination.name} | Itvaya`,
      description,
      path: `/destinations/${destination.slug}`,
      imageUrl: destination.hero_image_url || undefined,
      type: 'website',
    });
  } catch {
    return {
      title: 'Destination Not Found',
    };
  }
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let destination;
  
  try {
    destination = await getDestinationBySlug(resolvedParams.slug);
  } catch {
    // If not found, return 404
    notFound();
  }

  // Fetch parallel related data
  let listings: ListingSummary[] = [];
  let experiences: ExperienceSummary[] = [];
  
  try {
    const results = await Promise.allSettled([
      getListings({ destination_id: destination.id, limit: 8 }),
      getExperiences({ destination_id: destination.id, limit: 6 })
    ]);
    
    if (results[0].status === 'fulfilled') listings = results[0].value;
    if (results[1].status === 'fulfilled') experiences = results[1].value;
  } catch (error) {
    console.error("Error fetching destination related data:", error);
  }

  const url = getAbsoluteUrl(`/destinations/${destination.slug}`);
  const baseUrl = getAbsoluteUrl('/');

  const breadcrumbItems = [
    { name: "Home", url: baseUrl },
    { name: "Destinations", url: `${baseUrl}destinations` },
    { name: destination.name, url: url }
  ];

  return (
    <>
      <TouristDestinationSchema 
        name={destination.name}
        description={destination.description || destination.short_description || `Discover ${destination.name}`}
        url={url}
        image={destination.hero_image_url || undefined}
        country={destination.country}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[50vh] min-h-[400px] w-full bg-muted">
          {destination.hero_image_url ? (
            <Image 
              src={destination.hero_image_url} 
              alt={destination.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-muted"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 w-full p-8 md:p-16">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{destination.name}</h1>
            <p className="text-xl text-white/90">{destination.state_province_region ? `${destination.state_province_region}, ` : ''}{destination.country}</p>
          </div>
        </section>

        <PageContainer className="py-12 md:py-16">
          <Breadcrumbs items={breadcrumbItems} />
          {/* Overview Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="font-display text-3xl font-bold mb-4">About {destination.name}</h2>
                <div className="text-muted leading-relaxed prose prose-neutral">
                  {destination.description ? (
                    <p>{destination.description}</p>
                  ) : (
                    <p>{destination.short_description || "Discover the beauty and culture of this amazing destination."}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm h-fit">
              <h3 className="font-semibold text-lg mb-4">Travel Information</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-muted">Country</span>
                  <span className="font-medium">{destination.country}</span>
                </li>
                {destination.timezone && (
                  <li className="flex justify-between items-center border-b border-border pb-4">
                    <span className="text-muted">Timezone</span>
                    <span className="font-medium">{destination.timezone}</span>
                  </li>
                )}
                {destination.latitude && destination.longitude && (
                  <li className="flex justify-between items-center">
                    <span className="text-muted">Coordinates</span>
                    <span className="font-medium">{destination.latitude.toFixed(2)}, {destination.longitude.toFixed(2)}</span>
                  </li>
                )}
              </ul>
              <Button className="w-full mt-6" variant="primary">Plan a trip</Button>
            </div>
          </div>

          {/* Popular Stays */}
          {listings.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-display text-3xl font-bold">Popular Stays in {destination.name}</h2>
                <Link href={`/search?destination_id=${destination.id}&type=listing`} className="text-primary font-semibold hover:underline hidden md:block">See all</Link>
              </div>
              <Grid className="lg:grid-cols-4 xl:grid-cols-4">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </Grid>
            </div>
          )}

          {/* Experiences */}
          {experiences.length > 0 && (
            <div>
              <div className="flex justify-between items-end mb-8">
                <h2 className="font-display text-3xl font-bold">Top Experiences</h2>
                <Link href={`/search?destination_id=${destination.id}&type=experience`} className="text-primary font-semibold hover:underline hidden md:block">See all</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiences.map(experience => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
            </div>
          )}
        </PageContainer>
      </main>
    </>
  );
}

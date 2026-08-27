import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { DestinationsSection } from '@/components/home/DestinationsSection';
import { TrendingStaysSection } from '@/components/home/TrendingStaysSection';
import { ExperiencesSection } from '@/components/home/ExperiencesSection';
import { PageContainer } from '@/components/layout/PageContainer';
import { getDestinations, type DestinationSummary } from '@/lib/api/destinations';
import { getListings, type ListingSummary } from '@/lib/api/listings';
import { getExperiences, type ExperienceSummary } from '@/lib/api/experiences';

export const metadata = {
  title: "Itvaya | Discover, Plan & Book Your Journey",
  description: "Discover, plan, and book your next premium travel experience with Itvaya.",
};

export default async function HomePage() {
  // Fetch data in parallel for optimal performance
  // In a real application, you might add Suspense boundaries or Error boundaries
  // We'll wrap these in try-catch so the page doesn't completely fail if one service is down
  
  let destinations: DestinationSummary[] = [];
  let listings: ListingSummary[] = [];
  let experiences: ExperienceSummary[] = [];

  try {
    const results = await Promise.allSettled([
      getDestinations({ limit: 4 }),
      getListings({ limit: 4 }),
      getExperiences({ limit: 4 })
    ]);

    if (results[0].status === 'fulfilled') destinations = results[0].value;
    if (results[1].status === 'fulfilled') listings = results[1].value;
    if (results[2].status === 'fulfilled') experiences = results[2].value;

  } catch (error) {
    console.error("Error fetching homepage data:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Itvaya",
    "url": process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/search?query={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PageContainer>
          <DestinationsSection destinations={destinations} />
          <TrendingStaysSection listings={listings} />
          <ExperiencesSection experiences={experiences} />
        </PageContainer>
      </main>
      
      <footer className="mt-auto border-t border-border bg-surface py-8 text-center text-sm text-muted">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Itvaya. All rights reserved.
        </div>
      </footer>
    </>
  );
}

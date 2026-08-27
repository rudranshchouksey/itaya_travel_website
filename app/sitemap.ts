import { MetadataRoute } from 'next';
import { getDestinations } from '@/lib/api/destinations';
import { getListings } from '@/lib/api/listings';
import { getExperiences } from '@/lib/api/experiences';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ];

  try {
    // Fetch all dynamic entries. In a production app with huge data, this should be paginated
    // using generateSitemaps, but for now we fetch up to 1000 items each.
    const [destinations, listings, experiences] = await Promise.allSettled([
      getDestinations({ limit: 1000 }),
      getListings({ limit: 1000 }),
      getExperiences({ limit: 1000 })
    ]);

    if (destinations.status === 'fulfilled' && destinations.value) {
      destinations.value.forEach((dest) => {
        routes.push({
          url: `${baseUrl}/destinations/${dest.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    }

    if (listings.status === 'fulfilled' && listings.value) {
      listings.value.forEach((listing) => {
        routes.push({
          url: `${baseUrl}/listings/${listing.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }

    if (experiences.status === 'fulfilled' && experiences.value) {
      experiences.value.forEach((exp) => {
        routes.push({
          url: `${baseUrl}/experiences/${exp.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Error generating sitemap", error);
  }

  return routes;
}

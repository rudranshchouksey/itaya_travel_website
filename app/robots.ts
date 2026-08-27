import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/profile',
        '/account',
        '/bookings',
        '/checkout',
        '/payment',
        '/trips/private',
        '/sign-in',
        '/sign-up',
        '/search'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

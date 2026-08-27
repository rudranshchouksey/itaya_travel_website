# SEO Audit & Implementation Report

## Current SEO Status
Prior to optimization, the Itvaya application had basic metadata defined in `app/layout.tsx` and some dynamic titles for detail pages, but lacked a comprehensive SEO architecture. 
- Structured Data (JSON-LD) was entirely missing.
- Canonical URLs were absent, exposing the site to duplicate content issues via query parameters.
- `sitemap.ts` contained only static hardcoded routes.
- `robots.ts` did not enforce strict indexing policies on private or filter-heavy routes.
- No Open Graph images were dynamically generated from API models.

## Issues Found
- Missing canonical URLs on dynamic entity pages.
- Missing Open Graph and Twitter card metadata for dynamic pages.
- Missing JSON-LD representations of core domain entities (Destinations, Listings, Experiences).
- Missing Organization and WebSite schema.
- Sitemap did not include any real backend data.
- Search page did not have a `noindex` directive, meaning infinite parameter combinations could be crawled.
- `.env.example` lacked the `NEXT_PUBLIC_SITE_URL` needed for absolute URL generation.

## Issues Fixed
- **Environment**: Added `NEXT_PUBLIC_SITE_URL` to `.env.example` to ensure robust absolute URLs.
- **Global Metadata**: Added canonical alternate to the root layout and enhanced default Open Graph / Twitter defaults.
- **Organization & WebSite Schema**: Implemented `Organization` schema globally in `app/layout.tsx` and `WebSite` schema with a `SearchAction` in `app/page.tsx`.
- **Search Page Strategy**: Added explicit `metadata = { robots: { index: false, follow: true } }` to `app/search/page.tsx` to stop arbitrary filter permutation indexing.
- **Dynamic SEO on Destinations**: Injected canonical URL, dynamic OG image (from `hero_image_url`), Twitter card, `TouristDestination` schema, and `BreadcrumbList`.
- **Dynamic SEO on Listings**: Injected canonical URL, dynamic OG image, `LodgingBusiness` schema with address and rating data, and `BreadcrumbList`.
- **Dynamic SEO on Experiences**: Injected canonical URL, dynamic OG image, `Product` schema with offers and ratings, and `BreadcrumbList`.
- **Dynamic Sitemap**: Overhauled `app/sitemap.ts` to actively fetch up to 1,000 destinations, listings, and experiences in parallel using the existing API client.
- **Robots.txt Rules**: Updated `app/robots.ts` to explicitly disallow crawling of `/profile`, `/account`, `/bookings`, `/checkout`, `/payment`, `/trips/private`, `/sign-in`, `/sign-up`, and `/search`.

## Indexable Routes
- `/` (Homepage)
- `/destinations/[slug]` (All active destinations)
- `/listings/[slug]` (All active listings)
- `/experiences/[slug]` (All active experiences)

## Non-Indexable Routes
- `/search` (Disallowed via robots.txt and explicit `noindex` tag)
- `/profile`
- `/account`
- `/bookings`
- `/checkout`
- `/payment`
- `/trips/private`
- `/sign-in`
- `/sign-up`

## Metadata Strategy
- Default title format: `%s | Itvaya`
- Each dynamic page overrides the title and description using `generateMetadata`.
- Fallback text defaults gracefully if API returns incomplete data.
- Absolute canonical URLs point to the clean route path, stripping any user-added tracking query parameters.

## Canonical Strategy
- Base URL relies on `NEXT_PUBLIC_SITE_URL` (falling back to `http://localhost:3000` during dev).
- Each page implements `<link rel="canonical" />` implicitly via Next.js metadata `alternates: { canonical: ... }`.

## Sitemap
- Automatically maps database records to sitemap entries.
- Homepage is set to priority `1` (daily).
- Destinations are priority `0.9` (weekly).
- Listings & Experiences are priority `0.8` (daily).

## Robots
- User-Agent `*` allows root `/`.
- Strict exclusions on private/user-specific paths prevent auth leaks in SERPs.
- Dynamically references the absolute URL of the sitemap.

## Structured Data
- All implemented natively using `dangerouslySetInnerHTML` inside standard `<script type="application/ld+json">` tags, directly inside server components for instant crawling.

## Image SEO
- We mapped the backend's primary/hero images natively into Open Graph schemas.
- Existing frontend code relies heavily on `next/image` ensuring optimal lazy-loading and formatting.

## Performance Improvements
- SEO data is fetched alongside existing UI data in Server Components, preventing layout shifts and client-side delays.
- `Promise.allSettled` is used in the sitemap to ensure partial availability (e.g. if the experience API is down, listings will still map).

## Accessibility Improvements
- Maintained all existing accessibility. The added Breadcrumbs Schema inherently gives screen readers (if implemented in UI) and search engines better context on location hierarchy.

## Testing
- Ensure you run `npm run lint` and `npm run build` to verify there are no compilation errors introduced by the metadata types.

## Remaining Issues
- **Scaling Sitemap**: If listings/experiences exceed 1,000+, you will need to utilize Next.js `generateSitemaps` to create multiple chunks (`sitemap-1.xml`, `sitemap-2.xml`, etc.).
- **Backend Completeness**: Ensure the backend API actually returns complete data for `latitude`/`longitude` on listings so it correctly populates the `GeoCoordinates` schema. If missing, it will safely omit it from JSON-LD without breaking.

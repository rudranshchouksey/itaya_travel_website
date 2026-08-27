# SEO Architecture Documentation

## Overview
This document outlines the SEO architecture implemented for the Itvaya Travel web application. The goal is to ensure that search engines can discover, crawl, understand, and index public travel content (destinations, listings, experiences) effectively while explicitly protecting private and application routes from being indexed.

## 1. Global Configuration
- **Environment Variable**: `NEXT_PUBLIC_SITE_URL` is required. This ensures canonical URLs, sitemaps, Open Graph metadata, and JSON-LD structured data use the correct production domain (or localhost for development).
- **Default Metadata**: The `app/layout.tsx` file provides strong default metadata (Title template, Description, OG metadata, and Twitter Card metadata). All pages automatically inherit these unless explicitly overridden.

## 2. Dynamic Metadata
For all entity pages (`app/destinations/[slug]`, `app/listings/[slug]`, `app/experiences/[slug]`), we use Next.js' `generateMetadata()`:
- **Canonical URLs**: We explicitly define canonical URLs using `alternates: { canonical: url }` to avoid duplicate indexing from query parameters.
- **Open Graph / Twitter**: We inject dynamic images (e.g., `hero_image_url` for destinations and `is_primary` for listings).
- **Graceful Fallbacks**: If a resource is not found (404), the metadata degrades gracefully instead of failing the page rendering.

## 3. Structured Data (JSON-LD) Component Architecture
We utilize a reusable component architecture located in `components/seo/*` to inject semantically rich data into the HTML `<head>`. This ensures type safety and DRY code:
- **Global**: `OrganizationSchema` component injected in `app/layout.tsx`.
- **Homepage**: `WebSiteSchema` component with a `SearchAction` allowing search engines to expose the site search directly in SERPs.
- **Destinations**: `TouristDestinationSchema` component containing name, description, country, and image.
- **Listings**: `LodgingSchema` component containing rating, reviews, coordinates, and address.
- **Experiences**: `ExperienceSchema` (Product type) detailing price, availability (InStock), and currency.
- **Breadcrumbs**: `BreadcrumbSchema` injected on all dynamic pages (Destination, Listing, Experience) paired seamlessly with a visual `Breadcrumbs` UI component.
- **Travel Guides**: Placeholder `ArticleSchema` is prepared for future editorial content.

## 4. Crawling & Indexing Policy
- **Robots.txt** (`app/robots.ts`): We explicitly disallow private application routes:
  - `/profile`
  - `/account`
  - `/bookings`
  - `/checkout`
  - `/payment`
  - `/trips/private`
  - `/sign-in`
  - `/sign-up`
  - `/search` (Search parameter permutations are hidden from search engines)
- **Search Page**: We added `metadata = { robots: { index: false, follow: true } }` on the search page to avoid indexing potentially infinite filter combinations.

## 5. Dynamic XML Sitemap
- `app/sitemap.ts` dynamically fetches up to 1,000 destinations, listings, and experiences from the backend API.
- Static priority values and update frequencies are mapped appropriately (e.g., Homepage = 1, Destinations = 0.9, Listings = 0.8).
- **Scaling Note**: If entities exceed 5,000-10,000, `generateSitemaps` must be implemented to chunk sitemap URLs into index files.

## 6. Programmatic SEO & Travel Guides Architecture
- **Travel Guides**: The routing structure for `/travel-guides` and `/travel-guides/[slug]` has been scaffolded in advance of backend support. These pages elegantly return `notFound()` natively so search engines do not index thin or fake content, but they contain the full `ArticleSchema` architectural blueprint.
- **Programmatic Landing Pages**: The frontend is prepared to scale. In the future, programmatic routes like `/stays/[destination_slug]` or `/experiences/[destination_slug]` can consume the `LodgingSchema` and `ExperienceSchema` components iteratively without re-writing metadata generation scripts.

## 7. Local Validation
To test SEO locally:
1. Ensure `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
2. Inspect the HTML `<head>` of any dynamic page.
3. Use Google's Rich Results Test and paste local HTML to validate JSON-LD schemas.
4. Visit `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt` to verify proper generation.

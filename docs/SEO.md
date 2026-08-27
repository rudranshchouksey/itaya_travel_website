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

## 3. Structured Data (JSON-LD)
We utilize `application/ld+json` script tags to inject semantically rich data into the HTML `<head>`:
- **Global**: `Organization` schema injected in `app/layout.tsx`.
- **Homepage**: `WebSite` schema with a `SearchAction` allowing search engines to expose the site search directly in SERPs.
- **Destinations**: `TouristDestination` schema containing name, description, country, and image.
- **Listings**: `LodgingBusiness` schema containing rating, reviews, coordinates, and address.
- **Experiences**: `Product` schema detailing price, availability (InStock), and currency.
- **Breadcrumbs**: `BreadcrumbList` schema injected on all dynamic pages (Destination, Listing, Experience) to provide clear hierarchy.

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

## 6. Local Validation
To test SEO locally:
1. Ensure `.env.local` has `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
2. Inspect the HTML `<head>` of any dynamic page.
3. Use Google's Rich Results Test and paste local HTML to validate JSON-LD schemas.
4. Visit `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt` to verify proper generation.

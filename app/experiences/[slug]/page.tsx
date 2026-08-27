import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { getExperienceBySlug } from '@/lib/api/experiences';
import { ExperienceGallery } from '@/components/experiences/ExperienceGallery';
import { ExperienceBookingCard } from '@/components/experiences/ExperienceBookingCard';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const experience = await getExperienceBySlug(params.slug);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/experiences/${experience.slug}`;
    const description = experience.description || `Experience ${experience.title}`;
    const primaryImage = experience.images?.find(img => img.is_primary)?.url || experience.images?.[0]?.url;

    return {
      title: `${experience.title} | Itvaya`,
      description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: `${experience.title} | Itvaya`,
        description,
        url,
        type: 'website',
        images: primaryImage ? [{ url: primaryImage, alt: experience.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${experience.title} | Itvaya`,
        description,
        images: primaryImage ? [primaryImage] : [],
      }
    };
  } catch {
    return {
      title: 'Experience Not Found',
    };
  }
}

export default async function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  let experience;
  try {
    experience = await getExperienceBySlug(params.slug);
  } catch {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/experiences/${experience.slug}`;
  const primaryImage = experience.images?.find(img => img.is_primary)?.url || experience.images?.[0]?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": experience.title,
    "description": experience.description || undefined,
    "image": primaryImage,
    "offers": {
      "@type": "Offer",
      "priceCurrency": experience.currency || "USD",
      "price": experience.base_price,
      "availability": "https://schema.org/InStock",
      "url": url
    },
    "aggregateRating": experience.average_rating ? {
      "@type": "AggregateRating",
      "ratingValue": experience.average_rating,
      "reviewCount": experience.total_reviews
    } : undefined
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Experiences",
        "item": `${baseUrl}/search?type=experience`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": experience.title,
        "item": url
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      
      {/* Editorial Full-width Gallery */}
      <ExperienceGallery images={experience.images || []} />

      <PageContainer className="pt-10">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Column: Storytelling Details */}
          <div className="flex-1 lg:w-2/3">
            <div className="mb-8">
              <div className="flex gap-2 mb-3">
                {experience.categories?.map(cat => (
                  <span key={cat.id} className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {cat.name}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">{experience.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground mt-4">
                {experience.average_rating && (
                  <span className="flex items-center gap-1 text-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-warning"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" /></svg>
                    {experience.average_rating} ({experience.total_reviews} reviews)
                  </span>
                )}
                <span>Hosted by Expert Provider</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border mb-10">
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Duration</p>
                <p className="font-medium text-foreground">{experience.duration_minutes} minutes</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Group Size</p>
                <p className="font-medium text-foreground">Up to {experience.guest_capacity}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Language</p>
                <p className="font-medium text-foreground">English</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold text-muted-foreground mb-1">Cancellation</p>
                <p className="font-medium text-foreground">Free up to 24h</p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">The Experience</h2>
              <div className="prose prose-neutral max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {experience.description || "Discover something unforgettable."}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Meeting Point</h2>
              <p className="text-foreground font-medium mb-2">{experience.meeting_point || "To be confirmed after booking."}</p>
              {/* Fake Map visual placeholder */}
              <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center border border-border">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Map view
                </span>
              </div>
            </div>
            
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">What&apos;s included</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Expert Guide
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-primary w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  All necessary equipment
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Booking Card */}
          <div className="w-full lg:w-1/3">
            <ExperienceBookingCard 
              experienceId={experience.id} 
              basePrice={typeof experience.base_price === 'string' ? parseFloat(experience.base_price) : experience.base_price} 
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

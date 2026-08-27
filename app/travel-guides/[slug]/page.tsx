import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { generateStandardMetadata, getAbsoluteUrl } from '@/lib/seo/utils';
import { ArticleSchema } from '@/components/seo/ArticleSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

// This is a placeholder for the future backend API call
const getTravelGuideBySlug = async (slug: string) => {
  // Simulate an API call returning null since we don't have guides yet
  // return await fetch(...);
  console.log(`Fetching guide for slug: ${slug}`);
  return null;
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const guide = await getTravelGuideBySlug(params.slug);
  
  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  const typedGuide = guide as Record<string, string>;

  // This block won't be reached currently, but represents the intended architecture
  return generateStandardMetadata({
    title: `${typedGuide.title} | Itvaya Guides`,
    description: typedGuide.excerpt || `Read our guide about ${typedGuide.title}`,
    path: `/travel-guides/${params.slug}`,
    imageUrl: typedGuide.hero_image_url || undefined,
    type: 'article',
  });
}

export default async function TravelGuideDetailPage({ params }: { params: { slug: string } }) {
  const guide = await getTravelGuideBySlug(params.slug);
  
  if (!guide) {
    notFound();
  }

  const typedGuide = guide as Record<string, string | Record<string, string>>;

  // This block won't be reached currently, but represents the intended architecture
  const url = getAbsoluteUrl(`/travel-guides/${params.slug}`);
  const baseUrl = getAbsoluteUrl('/');

  const breadcrumbItems = [
    { name: "Home", url: baseUrl },
    { name: "Travel Guides", url: `${baseUrl}travel-guides` },
    { name: typedGuide.title as string, url: url }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ArticleSchema 
        headline={typedGuide.title as string}
        description={typedGuide.excerpt as string}
        url={url}
        image={typedGuide.hero_image_url as string}
        authorName={(typedGuide.author as Record<string, string>)?.name || "Itvaya Editorial"}
        datePublished={typedGuide.published_at as string}
        dateModified={typedGuide.updated_at as string}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Header />
      
      <PageContainer className="py-8 md:py-12">
        <Breadcrumbs items={breadcrumbItems} />
        <article className="max-w-3xl mx-auto mt-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{typedGuide.title as string}</h1>
          <div className="prose prose-neutral max-w-none mt-8">
            {/* Future content rendering */}
            {typedGuide.content as string}
          </div>
        </article>
      </PageContainer>
    </div>
  );
}

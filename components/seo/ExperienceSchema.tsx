import React from 'react';
import { JsonLd } from './JsonLd';

interface ExperienceSchemaProps {
  name: string;
  description?: string;
  url: string;
  image?: string;
  currency: string;
  price: number;
  averageRating?: string | null;
  totalReviews?: number;
}

export const ExperienceSchema: React.FC<ExperienceSchemaProps> = ({
  name,
  description,
  url,
  image,
  currency,
  price,
  averageRating,
  totalReviews
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "offers": {
      "@type": "Offer",
      "priceCurrency": currency || "USD",
      "price": price,
      "availability": "https://schema.org/InStock",
      "url": url
    },
    "aggregateRating": averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": totalReviews || 0
    } : undefined
  };

  return <JsonLd data={data} />;
};

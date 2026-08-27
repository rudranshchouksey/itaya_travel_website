import React from 'react';
import { JsonLd } from './JsonLd';

interface LodgingSchemaProps {
  name: string;
  description?: string;
  url: string;
  image?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  averageRating?: string | null;
  totalReviews?: number;
}

export const LodgingSchema: React.FC<LodgingSchemaProps> = ({
  name,
  description,
  url,
  image,
  address,
  latitude,
  longitude,
  averageRating,
  totalReviews
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "address": address ? {
      "@type": "PostalAddress",
      "streetAddress": address
    } : undefined,
    "geo": (latitude && longitude) ? {
      "@type": "GeoCoordinates",
      "latitude": latitude,
      "longitude": longitude
    } : undefined,
    "aggregateRating": averageRating ? {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": totalReviews || 0
    } : undefined
  };

  return <JsonLd data={data} />;
};

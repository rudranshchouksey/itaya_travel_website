import React from 'react';
import { JsonLd } from './JsonLd';

interface TouristDestinationSchemaProps {
  name: string;
  description?: string;
  url: string;
  image?: string;
  country: string;
}

export const TouristDestinationSchema: React.FC<TouristDestinationSchemaProps> = ({
  name,
  description,
  url,
  image,
  country
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": name,
    "description": description,
    "url": url,
    "image": image,
    "containedInPlace": {
      "@type": "Country",
      "name": country
    }
  };

  return <JsonLd data={data} />;
};

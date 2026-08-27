import React from 'react';
import { JsonLd } from './JsonLd';

interface ArticleSchemaProps {
  headline: string;
  description?: string;
  url: string;
  image?: string;
  authorName: string;
  datePublished: string;
  dateModified?: string;
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  headline,
  description,
  url,
  image,
  authorName,
  datePublished,
  dateModified
}) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": image,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Itvaya",
      "logo": {
        "@type": "ImageObject",
        "url": url // A placeholder, better to use absolute root /favicon.ico
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    }
  };

  return <JsonLd data={data} />;
};

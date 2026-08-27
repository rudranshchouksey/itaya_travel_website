import React from 'react';
import { JsonLd } from './JsonLd';
import { getAbsoluteUrl } from '@/lib/seo/utils';

export const OrganizationSchema = () => {
  const url = getAbsoluteUrl('/');
  const logoUrl = getAbsoluteUrl('/favicon.ico');

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Itvaya",
    "url": url,
    "logo": logoUrl,
    "description": "Discover, plan, and book your next premium travel experience with Itvaya."
  };

  return <JsonLd data={data} />;
};

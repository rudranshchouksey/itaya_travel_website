import React from 'react';
import { JsonLd } from './JsonLd';
import { getAbsoluteUrl } from '@/lib/seo/utils';

export const WebSiteSchema = () => {
  const url = getAbsoluteUrl('/');
  const searchUrlTemplate = getAbsoluteUrl('/search?query={search_term_string}');

  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Itvaya",
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": searchUrlTemplate
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={data} />;
};

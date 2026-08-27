import { Metadata } from 'next';

export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
};

export interface GenerateStandardMetadataOptions {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

export const generateStandardMetadata = ({
  title,
  description,
  path,
  imageUrl,
  type = 'website',
  noindex = false,
}: GenerateStandardMetadataOptions): Metadata => {
  const url = getAbsoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      type,
      images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
};

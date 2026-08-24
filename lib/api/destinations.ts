import { apiClient } from './client';

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  country: string;
  state_province_region: string | null;
  city: string | null;
  short_description: string | null;
  hero_image_url: string | null;
  is_active: boolean;
}

export interface DestinationRead extends DestinationSummary {
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  created_at: string;
  updated_at: string;
}

export async function getDestinations(params?: { skip?: number; limit?: number; search?: string; country?: string }) {
  const query = new URLSearchParams();
  if (params?.skip) query.set('skip', params.skip.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.country) query.set('country', params.country);

  const qs = query.toString();
  return apiClient<DestinationSummary[]>(`/destinations${qs ? '?' + qs : ''}`);
}

export async function getDestinationBySlug(slug: string) {
  return apiClient<DestinationRead>(`/destinations/${slug}`);
}

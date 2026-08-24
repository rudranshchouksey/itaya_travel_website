import { apiClient } from './client';

export interface DestinationSummary {
  id: string;
  name: string;
  slug: string;
  country: string;
  description: string | null;
  hero_image_url: string | null;
  featured: boolean;
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

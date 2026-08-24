import { apiClient } from './client';

export interface ListingSummary {
  id: string;
  name: string;
  slug: string;
  property_type: string;
  headline: string | null;
  thumbnail_url: string | null;
  base_price_per_night: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  average_rating: string | null;
  total_reviews: number;
  is_public: boolean;
  destination_id: string | null;
}

export async function getListings(params?: { skip?: number; limit?: number; destination_id?: string; property_type?: string; guest_capacity?: number }) {
  const query = new URLSearchParams();
  if (params?.skip) query.set('skip', params.skip.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.destination_id) query.set('destination_id', params.destination_id);
  if (params?.property_type) query.set('property_type', params.property_type);
  if (params?.guest_capacity) query.set('guest_capacity', params.guest_capacity.toString());

  const qs = query.toString();
  return apiClient<ListingSummary[]>(`/listings${qs ? '?' + qs : ''}`);
}

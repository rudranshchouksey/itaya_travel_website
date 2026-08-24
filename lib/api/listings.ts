import { apiClient } from './client';

export interface AmenityRead {
  id: string;
  name: string;
  icon_url: string | null;
}

export interface ListingImageRead {
  id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface ListingAvailabilityRead {
  date: string;
  price: number;
  is_available: boolean;
}

export interface ListingSummary {
  id: string;
  destination_id: string;
  title: string;
  slug: string;
  property_type: string;
  guest_capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  status: string;
  verification_status: string;
  images: ListingImageRead[];
}

export interface ListingRead extends ListingSummary {
  host_id: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: AmenityRead[];
  created_at: string;
  updated_at: string;
}

// Map the old UI props that were requested in the card components earlier
// Note: If the backend doesn't return these directly, we'll gracefully handle it or compute them.
export interface LegacyListingCardProps {
  thumbnail_url?: string | null;
  base_price_per_night?: number | string;
  average_rating?: string | null;
  total_reviews?: number;
  is_public?: boolean;
}

export type ListingSummaryUI = ListingSummary & LegacyListingCardProps;
export type ListingReadUI = ListingRead & LegacyListingCardProps;

export async function getListings(params?: { skip?: number; limit?: number; destination_id?: string; property_type?: string; guest_capacity?: number }) {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set('skip', params.skip.toString());
  if (params?.limit !== undefined) query.set('limit', params.limit.toString());
  if (params?.destination_id) query.set('destination_id', params.destination_id);
  if (params?.property_type) query.set('property_type', params.property_type);
  if (params?.guest_capacity !== undefined) query.set('guest_capacity', params.guest_capacity.toString());

  const qs = query.toString();
  return apiClient<ListingSummaryUI[]>(`/listings${qs ? '?' + qs : ''}`);
}

export async function getListingBySlug(slug: string) {
  return apiClient<ListingReadUI>(`/listings/${slug}`);
}

export async function getListingAvailability(id: string, startDate: string, endDate: string) {
  const query = new URLSearchParams();
  query.set('start_date', startDate);
  query.set('end_date', endDate);
  
  const qs = query.toString();
  return apiClient<ListingAvailabilityRead[]>(`/listings/${id}/availability?${qs}`);
}

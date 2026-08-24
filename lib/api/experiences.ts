import { apiClient } from './client';

export interface ExperienceCategoryRead {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
}

export interface ExperienceImageRead {
  id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface ExperienceAvailabilityRead {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  price_override: number | null;
  is_available: boolean;
}

export interface ExperienceSummary {
  id: string;
  provider_id: string;
  destination_id: string;
  title: string;
  slug: string;
  duration_minutes: number;
  guest_capacity: number;
  base_price: number;
  currency: string;
  status: string;
  verification_status: string;
  categories: ExperienceCategoryRead[];
  images: ExperienceImageRead[];
}

export interface ExperienceRead extends ExperienceSummary {
  description: string | null;
  meeting_point: string | null;
}

// Map the old UI props that were requested in the card components earlier
export interface LegacyExperienceCardProps {
  thumbnail_url?: string | null;
  average_rating?: string | null;
  total_reviews?: number;
}

export type ExperienceSummaryUI = ExperienceSummary & LegacyExperienceCardProps;
export type ExperienceReadUI = ExperienceRead & LegacyExperienceCardProps;

export async function getExperiences(params?: { skip?: number; limit?: number; destination_id?: string; category_id?: string; max_price?: number }) {
  const query = new URLSearchParams();
  if (params?.skip !== undefined) query.set('skip', params.skip.toString());
  if (params?.limit !== undefined) query.set('limit', params.limit.toString());
  if (params?.destination_id) query.set('destination_id', params.destination_id);
  if (params?.category_id) query.set('category_id', params.category_id);
  if (params?.max_price !== undefined) query.set('max_price', params.max_price.toString());

  const qs = query.toString();
  return apiClient<ExperienceSummaryUI[]>(`/experiences${qs ? '?' + qs : ''}`);
}

export async function getExperienceBySlug(slug: string) {
  return apiClient<ExperienceReadUI>(`/experiences/${slug}`);
}

export async function getExperienceAvailability(id: string, startDate: string, endDate: string) {
  const query = new URLSearchParams();
  query.set('start_date', startDate);
  query.set('end_date', endDate);
  
  const qs = query.toString();
  return apiClient<ExperienceAvailabilityRead[]>(`/experiences/${id}/availability?${qs}`);
}

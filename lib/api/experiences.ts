import { apiClient } from './client';

export interface ExperienceSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration_minutes: number;
  base_price: string;
  thumbnail_url: string | null;
  average_rating: string | null;
  total_reviews: number;
  destination_id: string;
}

export async function getExperiences(params?: { skip?: number; limit?: number; destination_id?: string; category_id?: string; max_price?: string }) {
  const query = new URLSearchParams();
  if (params?.skip) query.set('skip', params.skip.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.destination_id) query.set('destination_id', params.destination_id);
  if (params?.category_id) query.set('category_id', params.category_id);
  if (params?.max_price) query.set('max_price', params.max_price);

  const qs = query.toString();
  return apiClient<ExperienceSummary[]>(`/experiences${qs ? '?' + qs : ''}`);
}

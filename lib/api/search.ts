import { apiClient } from './client';
import { ListingSummary } from './listings';
import { ExperienceSummary } from './experiences';

export interface SearchParams {
  query?: string;
  destination_id?: string;
  type?: 'listing' | 'experience' | 'all';
  min_price?: number;
  max_price?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'relevance';
  skip?: number;
  limit?: number;
}

export interface SearchResultItem {
  item_type: 'listing' | 'experience';
  item_id: string;
  relevance_score: number;
  data: ListingSummary | ExperienceSummary | Record<string, unknown>;
}

export interface SearchResponse {
  total_count: number;
  results: SearchResultItem[];
}

export async function unifiedSearch(params?: SearchParams) {
  const query = new URLSearchParams();
  if (params?.query) query.set('query', params.query);
  if (params?.destination_id) query.set('destination_id', params.destination_id);
  if (params?.type) query.set('type', params.type);
  if (params?.min_price !== undefined) query.set('min_price', params.min_price.toString());
  if (params?.max_price !== undefined) query.set('max_price', params.max_price.toString());
  if (params?.sort_by) query.set('sort_by', params.sort_by);
  if (params?.skip !== undefined) query.set('skip', params.skip.toString());
  if (params?.limit !== undefined) query.set('limit', params.limit.toString());

  const qs = query.toString();
  return apiClient<SearchResponse>(`/search${qs ? '?' + qs : ''}`);
}

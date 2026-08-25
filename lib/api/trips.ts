import { apiClient } from './client';

export interface Trip {
  id: string;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status: 'DRAFT' | 'UPCOMING' | 'PAST' | 'ACTIVE';
  destination_id?: string;
  created_at: string;
}

export async function getTrips(token: string, options?: { skip?: number, limit?: number }): Promise<Trip[]> {
  const params = new URLSearchParams();
  if (options?.skip) params.append('skip', options.skip.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  
  const query = params.toString() ? `?${params.toString()}` : '';
  
  return apiClient<Trip[]>(`/trips${query}`, {
    token,
    method: 'GET',
  });
}

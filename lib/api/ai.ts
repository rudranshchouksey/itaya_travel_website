import { apiClient } from './client';

export interface AITripPlanRequest {
  destination_id: string;
  start_date: string;
  end_date: string;
  budget?: number;
  traveler_count: number;
  travel_style: 'relaxed' | 'balanced' | 'packed';
  interests?: string[];
  preferred_accommodation: 'hotel' | 'hostel' | 'apartment' | 'villa' | 'any';
  free_form_request?: string;
}

export interface AITripOptimizationRequest {
  trip_id: string;
  instruction: string;
  target_budget?: number;
}

export interface AIProposedTripItem {
  item_type: 'stay' | 'experience' | 'transport' | 'activity' | 'custom';
  title: string;
  notes?: string;
  estimated_cost?: number;
  listing_id?: string;
  experience_id?: string;
}

export interface AIProposedTripDay {
  date: string;
  title: string;
  items: AIProposedTripItem[];
}

export interface AITripPlanResponse {
  title: string;
  destination_id: string;
  start_date: string;
  end_date: string;
  total_estimated_budget: number;
  explanation: string;
  days: AIProposedTripDay[];
}

export async function planTrip(
  token: string,
  data: AITripPlanRequest
): Promise<AITripPlanResponse> {
  return apiClient<AITripPlanResponse>('/ai/trips/plan', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function optimizeTrip(
  token: string,
  data: AITripOptimizationRequest
): Promise<AITripPlanResponse> {
  return apiClient<AITripPlanResponse>('/ai/trips/optimize', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

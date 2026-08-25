import { apiClient } from './client';

export interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  total_price: number;
  currency: string;
  item_type: 'STAY' | 'EXPERIENCE';
  item_id: string;
  provider?: string;
  start_date?: string;
  end_date?: string;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  cancellation_reason?: string;
  created_at: string;
}

export async function getBookings(token: string): Promise<Booking[]> {
  return apiClient<Booking[]>('/bookings', {
    token,
    method: 'GET',
  });
}

export async function getBooking(token: string, id: string): Promise<Booking> {
  return apiClient<Booking>(`/bookings/${id}`, {
    token,
    method: 'GET',
  });
}

import { apiClient } from './client';

export interface Booking {
  id: string;
  user_id: string;
  reference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  booking_status: string;
  payment_status: string;
  total: number;
  total_price?: number; // legacy
  subtotal: number;
  fees: number;
  taxes: number;
  platform_fee: number;
  provider_amount: number;
  discounts: number;
  currency: string;
  cancellation_reason?: string;
  created_at?: string;
  items: unknown[];
  guests: unknown[];
  item_type?: string; // legacy
  item_id?: string; // legacy
  provider?: string; // legacy
  start_date?: string; // legacy
  end_date?: string; // legacy
}

export interface BookingGuestCreate {
  first_name: string;
  last_name: string;
  email?: string;
  is_primary: boolean;
}

export interface BookingItemCreate {
  item_type: 'STAY' | 'EXPERIENCE' | 'FLIGHT' | 'CUSTOM';
  listing_id?: string;
  experience_id?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  quantity?: number;
  guest_count?: number;
}

export interface BookingCreate {
  trip_id?: string;
  currency: string;
  items: BookingItemCreate[];
  guests: BookingGuestCreate[];
}

export async function createBooking(token: string, data: BookingCreate): Promise<Booking> {
  return apiClient<Booking>('/bookings', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
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

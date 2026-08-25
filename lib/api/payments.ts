import { apiClient } from './client';

export interface PaymentCreateRequest {
  booking_id: string;
  idempotency_key?: string;
  user_currency?: string;
}

export interface PaymentCreateResponse {
  payment_id: string;
  provider_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  client_secret?: string;
  publishable_key?: string;
}

export interface PaymentVerifyRequest {
  payment_id: string;
  provider_payment_id: string;
  provider_order_id: string;
  provider_signature: string;
}

export interface PaymentRead {
  id: string;
  booking_id: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  captured_at?: string;
}

export async function createPayment(
  token: string,
  data: PaymentCreateRequest
): Promise<PaymentCreateResponse> {
  return apiClient<PaymentCreateResponse>('/payments/create', {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyPayment(
  token: string,
  paymentId: string,
  data: PaymentVerifyRequest
): Promise<PaymentRead> {
  return apiClient<PaymentRead>(`/payments/${paymentId}/verify`, {
    token,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPayment(
  token: string,
  paymentId: string
): Promise<PaymentRead> {
  return apiClient<PaymentRead>(`/payments/${paymentId}`, {
    token,
    method: 'GET',
  });
}

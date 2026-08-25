'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTripStore } from '@/lib/stores/TripContext';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { createBooking, Booking } from '@/lib/api/bookings';
import { createPayment } from '@/lib/api/payments';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_123');

function PaymentForm({ clientSecret, booking, onComplete }: { clientSecret: string, booking: Booking, onComplete: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirm?booking_id=${booking.id}`,
      },
      redirect: 'if_required' // We'll handle it here if it's test mode mostly, or let it redirect
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setIsLoading(false);
    } else {
      // Payment succeeded or redirecting
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto bg-surface p-6 rounded-2xl border border-border">
      <h3 className="text-xl font-bold">Payment Details</h3>
      <div className="space-y-4">
        <PaymentElement />
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <Button type="submit" disabled={!stripe || isLoading} className="w-full mt-6">
        {isLoading ? 'Processing...' : `Pay ${booking.currency.toUpperCase()} ${booking.total}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { trip } = useTripStore();
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Review, 2: Details, 3: Payment, 4: Confirmed
  const [guestDetails, setGuestDetails] = useState({ firstName: '', lastName: '', email: '' });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (user) {
      setGuestDetails({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      });
    }
  }, [user]);

  if (!mounted || !isLoaded) return null;

  if (!isSignedIn) {
    router.push('/');
    return null;
  }

  if (trip.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <PageContainer className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Your trip is empty</h1>
            <Button onClick={() => router.push(`/trips/${trip.id}`)}>Return to Trip Builder</Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  const handleCreateBooking = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");

      // Map frontend trip items to backend booking items
      const bookingItems = trip.items.map(item => ({
        item_type: item.item_type === 'FLIGHT' || item.item_type === 'CUSTOM' ? 'CUSTOM' as const : item.item_type as 'STAY' | 'EXPERIENCE',
        listing_id: item.item_type === 'STAY' ? '11111111-1111-1111-1111-111111111111' : undefined, // Mock UUID
        experience_id: item.item_type === 'EXPERIENCE' ? '22222222-2222-2222-2222-222222222222' : undefined, // Mock UUID
        start_date: trip.start_date || new Date().toISOString().split('T')[0],
        end_date: trip.end_date || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        start_time: '14:00:00',
        end_time: '11:00:00',
        quantity: 1,
        guest_count: trip.traveler_count,
      }));

      // Create Booking
      const newBooking = await createBooking(token, {
        trip_id: trip.id,
        currency: 'usd',
        items: bookingItems,
        guests: [{
          first_name: guestDetails.firstName,
          last_name: guestDetails.lastName,
          email: guestDetails.email,
          is_primary: true
        }]
      });
      setBooking(newBooking);

      // Create Payment
      const payment = await createPayment(token, {
        booking_id: newBooking.id,
        user_currency: 'usd'
      });

      if (payment.client_secret) {
        setClientSecret(payment.client_secret);
        setStep(3); // Go to payment
      } else {
        throw new Error("Missing client secret from payment provider");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to create booking");
      } else {
        setError("Failed to create booking");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="bg-surface border-b border-border py-8">
        <PageContainer>
          <div className="max-w-3xl mx-auto flex justify-between items-center text-sm font-medium">
            <span className={step >= 1 ? 'text-primary' : 'text-muted-foreground'}>1. Review</span>
            <span className="text-border px-4">→</span>
            <span className={step >= 2 ? 'text-primary' : 'text-muted-foreground'}>2. Details</span>
            <span className="text-border px-4">→</span>
            <span className={step >= 3 ? 'text-primary' : 'text-muted-foreground'}>3. Payment</span>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Review your trip: {trip.title}</h2>
              <div className="space-y-4 mb-8">
                {trip.items.map(item => (
                  <div key={item.id} className="flex justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.item_type}</div>
                    </div>
                    <div className="font-medium text-muted-foreground">Estimated: ${item.estimated_cost}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)}>Continue to Guest Details</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Traveler Details</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={guestDetails.firstName}
                    onChange={(e) => setGuestDetails({...guestDetails, firstName: e.target.value})}
                    className="w-full p-2 border border-border rounded bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={guestDetails.lastName}
                    onChange={(e) => setGuestDetails({...guestDetails, lastName: e.target.value})}
                    className="w-full p-2 border border-border rounded bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <input 
                    type="email" 
                    value={guestDetails.email}
                    onChange={(e) => setGuestDetails({...guestDetails, email: e.target.value})}
                    className="w-full p-2 border border-border rounded bg-background"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleCreateBooking} disabled={isProcessing}>
                  {isProcessing ? 'Generating Booking...' : 'Continue to Payment'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && booking && clientSecret && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Price Breakdown from Backend */}
              <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm h-fit">
                <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${booking.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>${booking.taxes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fees</span>
                    <span>${booking.fees}</span>
                  </div>
                  {booking.discounts > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${booking.discounts}</span>
                    </div>
                  )}
                  <hr className="border-border" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total ({booking.currency.toUpperCase()})</span>
                    <span>${booking.total}</span>
                  </div>
                </div>
                <div className="mt-6 text-xs text-muted-foreground">
                  Booking Reference: {booking.reference}
                </div>
              </div>

              {/* Stripe Payment */}
              <div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm 
                    clientSecret={clientSecret} 
                    booking={booking} 
                    onComplete={() => router.push(`/checkout/confirm?booking_id=${booking.id}`)}
                  />
                </Elements>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

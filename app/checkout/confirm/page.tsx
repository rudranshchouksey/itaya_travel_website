'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { getBooking, Booking } from '@/lib/api/bookings';
import Link from 'next/link';

interface BookingItem {
  item_type: string;
  start_date?: string;
  end_date?: string;
}

interface BookingGuest {
  first_name: string;
  last_name: string;
  is_primary: boolean;
  email?: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("Please log in to view booking details.");
      setLoading(false);
      return;
    }

    if (!bookingId) {
      setError("No booking reference provided.");
      setLoading(false);
      return;
    }

    const fetchBooking = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication failed");
        
        const data = await getBooking(token, bookingId);
        setBooking(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to load booking details.");
        } else {
          setError("Failed to load booking details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isLoaded, isSignedIn, getToken]);

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <Header />
      
      <PageContainer className="py-16 flex-1 flex flex-col items-center">
        {loading && <div className="text-muted-foreground">Loading confirmation details...</div>}
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-6 rounded-2xl max-w-lg w-full text-center">
            <h2 className="text-xl font-bold mb-2">Oops!</h2>
            <p>{error}</p>
            <Link href="/" passHref>
              <Button className="mt-6" variant="outline">Return Home</Button>
            </Link>
          </div>
        )}

        {booking && (
          <div className="max-w-2xl w-full">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h1 className="text-4xl font-display font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Your payment is processing and your booking is confirmed.
              </p>
            </div>

            <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 mb-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Booking Reference</div>
                  <div className="font-mono font-bold text-lg">{booking.reference || booking.id.split('-')[0].toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {booking.status || 'CONFIRMED'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Payment Status</div>
                  <div className="font-medium text-primary">
                    {booking.payment_status || 'PROCESSING'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Total Paid</div>
                  <div className="font-bold text-lg">
                    {booking.currency.toUpperCase()} ${booking.total}
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="font-bold text-lg mb-4">Itinerary Summary</h3>
                <div className="space-y-3">
                  {(booking.items as BookingItem[])?.map((item: BookingItem, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium">{item.item_type} Booking</div>
                        <div className="text-sm text-muted-foreground">
                          {item.start_date} to {item.end_date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="font-bold text-lg mb-4">Traveler Information</h3>
                <div className="space-y-2">
                  {(booking.guests as BookingGuest[])?.map((guest: BookingGuest, idx: number) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{guest.first_name} {guest.last_name}</span> 
                      {guest.is_primary && <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full">Primary</span>}
                      <div className="text-muted-foreground">{guest.email}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href={`/bookings/${booking.id}`} passHref>
                <Button variant="outline">View Booking Details</Button>
              </Link>
              <Link href="/" passHref>
                <Button>Back to Home</Button>
              </Link>
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

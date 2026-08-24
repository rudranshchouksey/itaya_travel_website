'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useTripStore } from '@/lib/stores/TripContext';
import { useRouter } from 'next/navigation';

interface BookingCardProps {
  listingId: string;
  basePrice: number;
}

export function BookingCard({ listingId, basePrice }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const { addItem } = useTripStore();
  const router = useRouter();
  const [nights, setNights] = useState<number>(0);

  // Calculate nights when dates change
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const cleaningFee = 50;
  const serviceFee = Math.round(basePrice * nights * 0.12);
  const total = (basePrice * nights) + cleaningFee + serviceFee;

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl p-6 sticky top-24">
      <div className="mb-6">
        <span className="text-2xl font-bold">${basePrice}</span>
        <span className="text-muted ml-1">/ night</span>
      </div>

      <div className="border border-border rounded-xl overflow-hidden mb-4">
        <div className="flex border-b border-border">
          <div className="p-3 border-r border-border w-1/2">
            <label className="block text-xs font-bold uppercase mb-1">Check-in</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="p-3 w-1/2">
            <label className="block text-xs font-bold uppercase mb-1">Check-out</label>
            <input 
              type="date" 
              className="w-full text-sm outline-none bg-transparent"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div className="p-3">
          <label className="block text-xs font-bold uppercase mb-1">Guests</label>
          <select 
            className="w-full text-sm outline-none bg-transparent"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <Button className="w-full mb-2">Book Now</Button>
      <Button 
        variant="outline" 
        className="w-full mb-4 bg-muted/50" 
        onClick={() => {
          addItem({
            item_type: 'STAY',
            title: `Accommodation at ${listingId.substring(0,8)}...`, // Mock title
            estimated_cost: total || basePrice,
            day_index: 0,
            listing_id: listingId,
            notes: checkIn && checkOut ? `${checkIn} to ${checkOut}` : 'Dates to be decided'
          });
          router.push('/trips/local');
        }}
      >
        Add to Trip
      </Button>
      <p className="text-center text-sm text-muted mb-6">You won't be charged yet</p>

      {nights > 0 && (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="underline decoration-muted underline-offset-4">${basePrice} x {nights} nights</span>
            <span>${basePrice * nights}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline decoration-muted underline-offset-4">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline decoration-muted underline-offset-4">Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between font-bold text-base">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      )}
    </div>
  );
}

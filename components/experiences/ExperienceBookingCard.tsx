'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useTripStore } from '@/lib/stores/TripContext';
import { useRouter } from 'next/navigation';

interface ExperienceBookingCardProps {
  experienceId: string;
  basePrice: number;
}

export function ExperienceBookingCard({ experienceId, basePrice }: ExperienceBookingCardProps) {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('09:00');
  const [guests, setGuests] = useState<number>(1);
  const { addItem } = useTripStore();
  const router = useRouter();

  const serviceFee = Math.round(basePrice * guests * 0.10);
  const total = (basePrice * guests) + serviceFee;

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl p-6 sticky top-24">
      <div className="mb-6">
        <span className="text-2xl font-bold">${basePrice}</span>
        <span className="text-muted ml-1">/ person</span>
      </div>

      <div className="border border-border rounded-xl overflow-hidden mb-6">
        <div className="p-3 border-b border-border">
          <label className="block text-xs font-bold uppercase mb-1">Date</label>
          <input 
            type="date" 
            className="w-full text-sm outline-none bg-transparent"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex border-b border-border">
          <div className="p-3 border-r border-border w-1/2">
            <label className="block text-xs font-bold uppercase mb-1">Time</label>
            <select 
              className="w-full text-sm outline-none bg-transparent"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="09:00">09:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="16:00">04:00 PM</option>
            </select>
          </div>
          <div className="p-3 w-1/2">
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
      </div>

      <Button className="w-full mb-2">Book Experience</Button>
      <Button 
        variant="outline" 
        className="w-full mb-4 bg-muted/50" 
        onClick={() => {
          addItem({
            item_type: 'EXPERIENCE',
            title: `Experience ${experienceId.substring(0,8)}...`, // Mock title
            estimated_cost: total || basePrice,
            day_index: 0,
            experience_id: experienceId,
            notes: date ? `Scheduled for ${date} at ${time}` : 'Flexible date'
          });
          router.push('/trips/local');
        }}
      >
        Add to Trip
      </Button>
      <p className="text-center text-sm text-muted mb-6">You won&apos;t be charged yet</p>

      {date && (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="underline decoration-muted underline-offset-4">${basePrice} x {guests} guest{guests > 1 ? 's' : ''}</span>
            <span>${basePrice * guests}</span>
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

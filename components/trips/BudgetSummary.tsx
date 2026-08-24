'use client';

import React from 'react';
import { useTripStore } from '@/lib/stores/TripContext';
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';

export function BudgetSummary() {
  const { trip } = useTripStore();
  const { isSignedIn } = useUser();

  const accommodationCost = trip.items
    .filter(i => i.item_type === 'STAY')
    .reduce((sum, i) => sum + i.estimated_cost, 0);

  const experienceCost = trip.items
    .filter(i => i.item_type === 'EXPERIENCE')
    .reduce((sum, i) => sum + i.estimated_cost, 0);

  const transportCost = trip.items
    .filter(i => i.item_type === 'FLIGHT')
    .reduce((sum, i) => sum + i.estimated_cost, 0);

  const otherCost = trip.items
    .filter(i => i.item_type === 'CUSTOM')
    .reduce((sum, i) => sum + i.estimated_cost, 0);

  const total = accommodationCost + experienceCost + transportCost + otherCost;
  
  // Rough mockup for service fee calculation
  const fees = Math.round(total * 0.1); 
  const grandTotal = total + fees;

  const handleSave = () => {
    if (!isSignedIn) {
      alert("You need to log in to save this trip permanently!");
      // In a real app, this would trigger the Clerk Auth modal
    } else {
      alert("Trip saved successfully to the backend!");
      // In a real app, this would POST to /trips
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-xl p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-6">Budget Estimate</h2>

      <div className="space-y-4 text-sm mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Accommodations</span>
          <span className="font-medium">${accommodationCost}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Experiences</span>
          <span className="font-medium">${experienceCost}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transport</span>
          <span className="font-medium">${transportCost}</span>
        </div>
        {otherCost > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Other</span>
            <span className="font-medium">${otherCost}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground underline decoration-muted underline-offset-4 cursor-help" title="Estimated taxes and service fees">Fees & Taxes</span>
          <span className="font-medium">${fees}</span>
        </div>
        
        <hr className="border-border" />
        
        <div className="flex justify-between font-bold text-lg">
          <span>Estimated Total</span>
          <span>${grandTotal}</span>
        </div>
      </div>

      <Button className="w-full mb-3" onClick={handleSave}>
        {isSignedIn ? 'Save Itinerary' : 'Log in to save'}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        Prices are estimates and do not guarantee final booking amounts.
      </p>
    </div>
  );
}

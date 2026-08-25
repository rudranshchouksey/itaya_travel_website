'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { ItineraryTimeline } from '@/components/trips/ItineraryTimeline';
import { BudgetSummary } from '@/components/trips/BudgetSummary';
import { useTripStore } from '@/lib/stores/TripContext';

export default function TripBuilderPage() {
  const { trip, updateTitle } = useTripStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(trip.title);

  // Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    setTempTitle(trip.title);
  }, [trip.title]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      <Header />
      
      {/* Trip Header */}
      <div className="border-b border-border bg-surface pt-12 pb-8">
        <PageContainer>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {trip.items.length} Activities • {trip.traveler_count} Travelers
              </div>
              
              {isEditingTitle ? (
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="font-display text-4xl md:text-5xl font-bold bg-transparent border-b-2 border-primary focus:outline-none"
                    autoFocus
                    onBlur={() => {
                      updateTitle(tempTitle);
                      setIsEditingTitle(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTitle(tempTitle);
                        setIsEditingTitle(false);
                      }
                    }}
                  />
                </div>
              ) : (
                <h1 
                  className="font-display text-4xl md:text-5xl font-bold cursor-pointer hover:text-primary transition-colors flex items-center gap-3"
                  onClick={() => setIsEditingTitle(true)}
                  title="Click to edit title"
                >
                  {trip.title}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                </h1>
              )}
              
              <div className="flex items-center gap-4 text-muted-foreground mt-4 font-medium">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  {trip.start_date ? `${trip.start_date} - ${trip.end_date}` : 'Dates not set'}
                </span>
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  {trip.traveler_count} Guests
                </span>
              </div>
            </div>
            
            {/* Action buttons could go here */}
          </div>
        </PageContainer>
      </div>

      <PageContainer className="pt-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Itinerary */}
          <div className="flex-1 lg:w-2/3">
            <ItineraryTimeline />
          </div>

          {/* Budget Sidebar */}
          <div className="w-full lg:w-1/3">
            <BudgetSummary />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

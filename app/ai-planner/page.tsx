'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { getDestinations, DestinationSummary } from '@/lib/api/destinations';
import { planTrip, optimizeTrip, AITripPlanResponse, AIProposedTripItem, AIProposedTripDay } from '@/lib/api/ai';
import { useTripStore, TripItemType } from '@/lib/stores/TripContext';

// Simple Icons
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

export default function AIPlannerPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { clearTrip, updateTitle, updateDates, addItem } = useTripStore();

  const [destinations, setDestinations] = useState<DestinationSummary[]>([]);
  const [stage, setStage] = useState<'form' | 'loading' | 'results'>('form');
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [destinationId, setDestinationId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [travelerCount, setTravelerCount] = useState<number>(2);
  const [budget, setBudget] = useState<string>('');
  const [travelStyle, setTravelStyle] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [accommodation, setAccommodation] = useState<'hotel' | 'hostel' | 'apartment' | 'villa' | 'any'>('any');
  const [freeForm, setFreeForm] = useState<string>('');

  // Results State
  const [tripPlan, setTripPlan] = useState<AITripPlanResponse | null>(null);
  const [refinementText, setRefinementText] = useState<string>('');
  const [isRefining, setIsRefining] = useState<boolean>(false);

  useEffect(() => {
    // Fetch destinations for dropdown
    const fetchDestinations = async () => {
      try {
        const dests = await getDestinations();
        setDestinations(dests);
        if (dests.length > 0) setDestinationId(dests[0].id);
      } catch (err) {
        console.error("Failed to load destinations", err);
      }
    };
    fetchDestinations();
    
    // Set default dates
    const start = new Date();
    start.setDate(start.getDate() + 14); // 2 weeks from now
    const end = new Date(start);
    end.setDate(end.getDate() + 5); // 5 days trip
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationId || !startDate || !endDate) {
      setError("Please fill out the destination and dates.");
      return;
    }
    setError(null);
    setStage('loading');

    try {
      const token = (await getToken()) || 'mock_token';
      const response = await planTrip(token, {
        destination_id: destinationId,
        start_date: startDate,
        end_date: endDate,
        budget: budget ? parseFloat(budget) : undefined,
        traveler_count: travelerCount,
        travel_style: travelStyle,
        preferred_accommodation: accommodation,
        free_form_request: freeForm
      });
      setTripPlan(response);
      setStage('results');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to generate AI trip plan.");
      } else {
        setError("Failed to generate AI trip plan.");
      }
      setStage('form');
    }
  };

  const handleRefine = async () => {
    if (!refinementText.trim() || !tripPlan) return;
    setIsRefining(true);
    setError(null);

    try {
      const token = (await getToken()) || 'mock_token';
      // Pass a dummy UUID since we don't have a saved trip_id yet. 
      // In a real scenario, we might create a draft trip first.
      const mockTripId = '11111111-1111-1111-1111-111111111111';
      const response = await optimizeTrip(token, {
        trip_id: mockTripId,
        instruction: refinementText,
        target_budget: tripPlan.total_estimated_budget
      });
      
      // Since mock returns empty days, we'll just merge explanation and title for this demo
      setTripPlan({
        ...tripPlan,
        title: response.title,
        explanation: response.explanation,
        total_estimated_budget: response.total_estimated_budget,
        // keep days if mock cleared them, or use new days
        days: response.days.length > 0 ? response.days : tripPlan.days
      });
      setRefinementText('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to refine trip.");
      } else {
        setError("Failed to refine trip.");
      }
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveToTrip = () => {
    if (!tripPlan) return;
    
    // Convert AI response to TripContext format
    clearTrip();
    updateTitle(tripPlan.title);
    updateDates(tripPlan.start_date, tripPlan.end_date);
    
    tripPlan.days.forEach((day: AIProposedTripDay, index: number) => {
      day.items.forEach((item: AIProposedTripItem) => {
        let type: TripItemType = 'CUSTOM';
        if (item.item_type === 'stay') type = 'STAY';
        if (item.item_type === 'experience') type = 'EXPERIENCE';
        if (item.item_type === 'transport') type = 'FLIGHT';
        
        addItem({
          item_type: type,
          title: item.title,
          notes: item.notes,
          estimated_cost: item.estimated_cost || 0,
          day_index: index + 1,
          listing_id: item.listing_id,
          experience_id: item.experience_id,
        });
      });
    });

    router.push('/trips/local-draft');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {stage === 'form' && (
          <PageContainer className="py-16 max-w-3xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
                <SparkleIcon />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Plan with AI</h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tell us what you&apos;re looking for, and our AI will curate a personalized itinerary using real, bookable experiences and stays.
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-8">
                {error}
              </div>
            )}

            <form onSubmit={handlePlanTrip} className="bg-surface border border-border p-8 rounded-3xl shadow-sm space-y-8">
              {/* Row 1 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Where to?</label>
                  <select 
                    value={destinationId} 
                    onChange={e => setDestinationId(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    required
                  >
                    <option value="" disabled>Select a destination</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Travelers</label>
                  <input 
                    type="number" min="1" max="20"
                    value={travelerCount} 
                    onChange={e => setTravelerCount(parseInt(e.target.value) || 2)}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget (USD)</label>
                  <input 
                    type="number" placeholder="Optional max budget"
                    value={budget} 
                    onChange={e => setBudget(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Travel Style</label>
                  <select 
                    value={travelStyle} 
                    onChange={e => setTravelStyle(e.target.value as 'relaxed' | 'balanced' | 'packed')}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="relaxed">Relaxed</option>
                    <option value="balanced">Balanced</option>
                    <option value="packed">Packed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accommodation</label>
                  <select 
                    value={accommodation} 
                    onChange={e => setAccommodation(e.target.value as 'hotel' | 'hostel' | 'apartment' | 'villa' | 'any')}
                    className="w-full p-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="any">Any</option>
                    <option value="hotel">Hotel</option>
                    <option value="hostel">Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">Describe your perfect trip</label>
                <textarea 
                  rows={4}
                  placeholder="E.g., I want a peaceful getaway with lots of nature hikes, local food, and preferably a beachfront stay..."
                  value={freeForm}
                  onChange={e => setFreeForm(e.target.value)}
                  className="w-full p-4 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <Button type="submit" className="w-full py-6 text-lg rounded-xl flex items-center justify-center gap-2">
                <SparkleIcon /> Generate Itinerary
              </Button>
            </form>
          </PageContainer>
        )}

        {stage === 'loading' && (
          <PageContainer className="py-32 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-8"></div>
            <h2 className="text-2xl font-display font-bold mb-2">Curating your perfect trip...</h2>
            <p className="text-muted-foreground animate-pulse">Analyzing Itvaya inventory and matching preferences</p>
          </PageContainer>
        )}

        {stage === 'results' && tripPlan && (
          <PageContainer className="py-12 max-w-4xl">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-4xl font-display font-bold mb-3">{tripPlan.title}</h1>
                <div className="flex gap-4 text-muted-foreground text-sm font-medium">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {tripPlan.start_date} to {tripPlan.end_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Est. ${tripPlan.total_estimated_budget}
                  </span>
                </div>
              </div>
              <Button onClick={handleSaveToTrip} className="flex items-center gap-2">
                Save & Book
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </div>

            <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mb-10 flex gap-4">
              <div className="text-primary mt-1"><SparkleIcon /></div>
              <div>
                <h3 className="font-bold text-primary mb-1">AI Recommendation</h3>
                <p className="text-muted-foreground">{tripPlan.explanation}</p>
              </div>
            </div>

            <div className="space-y-12 mb-16">
              {tripPlan.days.map((day: AIProposedTripDay, idx: number) => (
                <div key={idx} className="relative pl-8 border-l-2 border-border/60">
                  <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[9px] top-1"></div>
                  <h3 className="text-xl font-bold mb-4">{day.title} <span className="text-muted-foreground font-normal text-base ml-2">{day.date}</span></h3>
                  
                  <div className="space-y-4">
                    {day.items.map((item: AIProposedTripItem, itemIdx: number) => (
                      <div key={itemIdx} className="bg-surface border border-border p-5 rounded-xl shadow-sm flex gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            {item.estimated_cost && <span className="font-medium bg-muted px-2 py-1 rounded text-sm">${item.estimated_cost}</span>}
                          </div>
                          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{item.item_type}</div>
                          {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
                        </div>
                      </div>
                    ))}
                    {day.items.length === 0 && (
                      <div className="text-sm text-muted-foreground italic">Free day to explore</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky Refinement Chat */}
            <div className="sticky bottom-6 bg-surface border border-border rounded-2xl shadow-xl p-4 flex gap-4 items-center mt-12">
              <input 
                type="text" 
                placeholder="E.g., Make it cheaper, Add more adventure, Give me a beachfront hotel..."
                className="flex-1 p-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors"
                value={refinementText}
                onChange={e => setRefinementText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRefine() }}
                disabled={isRefining}
              />
              <Button onClick={handleRefine} disabled={isRefining || !refinementText.trim()}>
                {isRefining ? 'Updating...' : 'Refine'}
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 text-center text-sm text-destructive">{error}</div>
            )}
          </PageContainer>
        )}
      </main>
    </div>
  );
}

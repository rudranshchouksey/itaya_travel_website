'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simplified types for the local store
export type TripItemType = 'STAY' | 'EXPERIENCE' | 'FLIGHT' | 'CUSTOM';

export interface LocalTripItem {
  id: string;
  item_type: TripItemType;
  title: string;
  notes?: string;
  estimated_cost: number;
  day_index: number; // 0 for unscheduled, 1+ for specific days
  order_index: number;
  listing_id?: string;
  experience_id?: string;
}

export interface LocalTrip {
  id: string; // usually 'local' or a generated UUID
  title: string;
  start_date?: string;
  end_date?: string;
  traveler_count: number;
  items: LocalTripItem[];
}

interface TripContextType {
  trip: LocalTrip;
  addItem: (item: Omit<LocalTripItem, 'id' | 'order_index'>) => void;
  removeItem: (id: string) => void;
  updateItemDay: (id: string, newDayIndex: number) => void;
  updateTitle: (title: string) => void;
  updateDates: (start: string, end: string) => void;
  clearTrip: () => void;
}

const defaultTrip: LocalTrip = {
  id: 'local-draft',
  title: 'My Incredible Trip',
  traveler_count: 2,
  items: [],
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<LocalTrip>(defaultTrip);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('itvaya_draft_trip');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTrip(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved trip", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever trip changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('itvaya_draft_trip', JSON.stringify(trip));
    }
  }, [trip, isLoaded]);

  const addItem = (itemData: Omit<LocalTripItem, 'id' | 'order_index'>) => {
    setTrip(prev => {
      const itemsInSameDay = prev.items.filter(i => i.day_index === itemData.day_index);
      const newOrderIndex = itemsInSameDay.length;
      
      const newItem: LocalTripItem = {
        ...itemData,
        id: Math.random().toString(36).substr(2, 9),
        order_index: newOrderIndex,
      };
      
      return { ...prev, items: [...prev.items, newItem] };
    });
  };

  const removeItem = (id: string) => {
    setTrip(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItemDay = (id: string, newDayIndex: number) => {
    setTrip(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, day_index: newDayIndex } : item
      ),
    }));
  };

  const updateTitle = (title: string) => setTrip(prev => ({ ...prev, title }));
  
  const updateDates = (start: string, end: string) => setTrip(prev => ({ ...prev, start_date: start, end_date: end }));

  const clearTrip = () => setTrip(defaultTrip);

  return (
    <TripContext.Provider value={{ trip, addItem, removeItem, updateItemDay, updateTitle, updateDates, clearTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTripStore() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripStore must be used within a TripProvider');
  }
  return context;
}

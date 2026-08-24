'use client';

import React, { useState } from 'react';
import { useTripStore, LocalTripItem } from '@/lib/stores/TripContext';
import { Button } from '@/components/ui/Button';

export function ItineraryTimeline() {
  const { trip, removeItem, updateItemDay } = useTripStore();
  const [editingDay, setEditingDay] = useState<string | null>(null);

  // Group items by day
  const itemsByDay: Record<number, LocalTripItem[]> = {};
  
  // Initialize days 0 to 3 (0 is Unscheduled)
  for (let i = 0; i <= 3; i++) {
    itemsByDay[i] = [];
  }

  trip.items.forEach(item => {
    if (!itemsByDay[item.day_index]) {
      itemsByDay[item.day_index] = [];
    }
    itemsByDay[item.day_index].push(item);
  });

  // Sort items within each day by order_index
  Object.keys(itemsByDay).forEach(day => {
    itemsByDay[parseInt(day)].sort((a, b) => a.order_index - b.order_index);
  });

  const getDayTitle = (dayIndex: number) => {
    if (dayIndex === 0) return 'Unscheduled Items';
    return `Day ${dayIndex}`;
  };

  const moveItem = (item: LocalTripItem, direction: 'up' | 'down') => {
    // Basic logic to move item between days for simplicity
    const currentDay = item.day_index;
    let newDay = currentDay;
    
    if (direction === 'up' && currentDay > 0) newDay = currentDay - 1;
    if (direction === 'down' && currentDay < 5) newDay = currentDay + 1; // max 5 days for mockup
    
    if (newDay !== currentDay) {
      updateItemDay(item.id, newDay);
    }
  };

  return (
    <div className="space-y-12">
      {Object.entries(itemsByDay).map(([dayStr, items]) => {
        const dayIndex = parseInt(dayStr, 10);
        
        // Skip rendering days with no items, except Unscheduled if there are items, or always show Day 1-3
        if (dayIndex > 3 && items.length === 0) return null;
        if (dayIndex === 0 && items.length === 0) return null;

        return (
          <div key={dayIndex} className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-10 bottom-0 w-px bg-border -z-10 hidden md:block"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                {dayIndex === 0 ? '?' : dayIndex}
              </div>
              <h2 className="text-2xl font-semibold">{getDayTitle(dayIndex)}</h2>
            </div>

            <div className="md:ml-12 space-y-4">
              {items.length === 0 ? (
                <div className="bg-surface border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground ml-6">
                  No activities scheduled for this day yet.
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={item.id} className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 ml-6 hover:shadow-md transition-shadow relative group">
                    
                    {/* Item Icon based on type */}
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      {item.item_type === 'STAY' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      )}
                      {item.item_type === 'EXPERIENCE' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13 4 4-4 4"/></svg>
                      )}
                      {item.item_type === 'FLIGHT' && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3.2-1.1c-.4-.1-.8.1-1 .5L1.5 16l4.5 2.5L8.5 23l1.5-1.5c.4-.2.6-.6.5-1L9.4 17l3-3 4 6 1.2-.7c.4-.2.7-.6.6-1.1z"/></svg>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <span className="font-medium text-foreground">${item.estimated_cost}</span>
                      </div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                        {item.item_type}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}
                    </div>

                    {/* Actions (Move, Remove) */}
                    <div className="flex md:flex-col gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => moveItem(item, 'up')} className="p-1.5 rounded hover:bg-muted text-muted-foreground" title="Move to previous day">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                       </button>
                       <button onClick={() => moveItem(item, 'down')} className="p-1.5 rounded hover:bg-muted text-muted-foreground" title="Move to next day">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                       </button>
                       <button onClick={() => removeItem(item.id)} className="p-1.5 rounded hover:bg-destructive/20 text-destructive" title="Remove item">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                       </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

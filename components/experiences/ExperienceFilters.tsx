'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function ExperienceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for visual mockups of non-backend supported filters & backend supported filters
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [category, setCategory] = useState(searchParams.get('category_id') || '');
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');

  // Sync state if URL changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxPrice(searchParams.get('max_price') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(searchParams.get('category_id') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDuration(searchParams.get('duration') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRating(searchParams.get('rating') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    if (category) params.set('category_id', category);
    else params.delete('category_id');

    if (duration) params.set('duration', duration);
    else params.delete('duration');

    if (rating) params.set('rating', rating);
    else params.delete('rating');

    // Reset pagination to first page
    params.delete('skip');

    router.push(`/experiences?${params.toString()}`);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Category */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Category</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {/* Note: In a real app we would fetch categories dynamically */}
          <option value="cultural">Cultural</option>
          <option value="adventure">Adventure</option>
          <option value="food">Food & Drink</option>
          <option value="nature">Nature</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Max Price ($)</h3>
        <input 
          type="number" 
          placeholder="Any price" 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Duration (Visual Mockup) */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Duration</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="">Any duration</option>
          <option value="short">Short (1-3 hours)</option>
          <option value="half_day">Half Day (4-6 hours)</option>
          <option value="full_day">Full Day (7+ hours)</option>
        </select>
      </div>

      {/* Rating (Visual Mockup) */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3">Minimum Rating</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="">Any rating</option>
          <option value="4.5">4.5+ (Excellent)</option>
          <option value="4.0">4.0+ (Very Good)</option>
          <option value="3.0">3.0+ (Good)</option>
        </select>
      </div>

      <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
    </div>
  );
}

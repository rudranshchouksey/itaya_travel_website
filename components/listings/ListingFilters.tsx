'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function ListingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for visual mockups of non-backend supported filters
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [guests, setGuests] = useState(searchParams.get('guest_capacity') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'recommended');

  // Sync state if URL changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(searchParams.get('min_price') || '');
     
    setMaxPrice(searchParams.get('max_price') || '');
     
    setGuests(searchParams.get('guest_capacity') || '');
     
    setPropertyType(searchParams.get('property_type') || '');
     
    setSortBy(searchParams.get('sort_by') || 'recommended');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice) params.set('min_price', minPrice);
    else params.delete('min_price');

    if (maxPrice) params.set('max_price', maxPrice);
    else params.delete('max_price');

    if (guests) params.set('guest_capacity', guests);
    else params.delete('guest_capacity');

    if (propertyType) params.set('property_type', propertyType);
    else params.delete('property_type');

    if (sortBy && sortBy !== 'recommended') params.set('sort_by', sortBy);
    else params.delete('sort_by');

    // Reset pagination to first page
    params.delete('skip');

    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Filters</h2>

      {/* Guests */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Guests</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          <option value="">Any number of guests</option>
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
          <option value="4">4+ guests</option>
          <option value="6">6+ guests</option>
        </select>
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Property Type</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Any property type</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="CABIN">Cabin</option>
          <option value="BOUTIQUE_HOTEL">Boutique Hotel</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Price Range ($/night)</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span className="text-muted">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Amenities (Visual Mockup) */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-3">Amenities</h3>
        <div className="space-y-3">
          {['Wifi', 'Kitchen', 'Pool', 'Air conditioning', 'Free parking'].map((amenity) => (
            <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" className="rounded border-input text-primary focus:ring-primary" />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3">Sort by</h3>
        <select 
          className="w-full h-10 px-3 rounded-lg border border-input bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recommended">Recommended</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <Button onClick={applyFilters} className="w-full">Apply Filters</Button>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const SearchFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [type, setType] = useState(searchParams.get('type') || 'all');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'relevance');

  // Sync state with URL if it changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setType(searchParams.get('type') || 'all');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMinPrice(searchParams.get('min_price') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxPrice(searchParams.get('max_price') || '');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSortBy(searchParams.get('sort_by') || 'relevance');
  }, [searchParams]);

  const applyFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (type && type !== 'all') current.set('type', type);
    else current.delete('type');
    
    if (minPrice) current.set('min_price', minPrice);
    else current.delete('min_price');
    
    if (maxPrice) current.set('max_price', maxPrice);
    else current.delete('max_price');
    
    if (sortBy && sortBy !== 'relevance') current.set('sort_by', sortBy);
    else current.delete('sort_by');

    // Reset pagination to page 1 on new filter
    current.delete('skip');
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/search${query}`);
  };

  const clearFilters = () => {
    router.push('/search');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-3">Sort By</h3>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full rounded-lg border border-border bg-transparent p-2 text-sm outline-none focus:border-primary"
        >
          <option value="relevance">Relevance</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-lg mb-3">Type</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="all" checked={type === 'all'} onChange={() => setType('all')} />
            <span>All</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="listing" checked={type === 'listing'} onChange={() => setType('listing')} />
            <span>Stays</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="experience" checked={type === 'experience'} onChange={() => setType('experience')} />
            <span>Experiences</span>
          </label>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-border bg-transparent p-2 text-sm outline-none focus:border-primary" 
          />
          <span className="text-muted">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-border bg-transparent p-2 text-sm outline-none focus:border-primary" 
          />
        </div>
      </div>

      <div className="border-t border-border pt-6 flex gap-2">
        <Button onClick={applyFilters} className="flex-1">Apply</Button>
        <Button onClick={clearFilters} variant="outline" className="flex-1">Clear</Button>
      </div>
    </div>
  );
};

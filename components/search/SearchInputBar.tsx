'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export const SearchInputBar = ({ initialQuery = '' }: { initialQuery?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get('query') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (query.trim()) {
      current.set('query', query.trim());
    } else {
      current.delete('query');
    }
    
    // reset pagination on new search
    current.delete('skip');
    
    const search = current.toString();
    const searchStr = search ? `?${search}` : '';
    router.push(`/search${searchStr}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-border bg-surface p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
      <div className="flex flex-1 items-center px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-muted">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input 
          type="text" 
          placeholder="Where to? Try 'goa' or 'beach'" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent p-2 text-sm outline-none placeholder:text-muted" 
        />
      </div>
      <Button type="submit" className="rounded-full px-6">
        Search
      </Button>
    </form>
  );
};

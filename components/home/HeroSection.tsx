import React from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';

export const HeroSection = () => {
  return (
    <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden bg-muted">
      <img
        src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        alt="Travel Destination"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <h1 className="mb-4 font-display text-4xl md:text-6xl font-bold text-white drop-shadow-sm">
          Discover your next journey
        </h1>
        <p className="mb-8 text-lg md:text-xl text-white/90 drop-shadow-sm">
          Premium stays, unique experiences, and unforgettable destinations.
        </p>
        
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl bg-surface/95 p-4 shadow-xl backdrop-blur-sm md:flex-row md:items-center md:gap-4 md:rounded-full md:p-3">
          <div className="flex-1 border-b border-border pb-2 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <label className="block pl-3 text-left text-xs font-bold text-foreground">Where</label>
            <SearchInput
              placeholder="Search destinations"
              className="border-none bg-transparent shadow-none focus:ring-0 pl-10 pt-1"
            />
          </div>
          <div className="flex-1 border-b border-border pb-2 md:border-b-0 md:border-r md:pb-0 md:pr-4">
            <label className="block pl-3 text-left text-xs font-bold text-foreground">Dates</label>
            <input type="text" placeholder="Add dates" className="w-full bg-transparent pl-3 pt-1 text-sm outline-none placeholder:text-muted" />
          </div>
          <div className="flex-1 pb-2 md:pb-0 md:pr-2">
            <label className="block pl-3 text-left text-xs font-bold text-foreground">Travelers</label>
            <input type="text" placeholder="Add guests" className="w-full bg-transparent pl-3 pt-1 text-sm outline-none placeholder:text-muted" />
          </div>
          <div className="pt-2 md:pt-0">
            <Button size="lg" className="w-full rounded-xl md:w-auto md:rounded-full bg-primary hover:bg-primary/90 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="mr-2 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

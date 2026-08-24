'use client';

import React, { useState } from 'react';
import { type ListingImageRead } from '@/lib/api/listings';
import Image from 'next/image';

interface ImageGalleryProps {
  images: ListingImageRead[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  // If no images, render placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[2/1] bg-muted rounded-2xl flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const primaryImage = images.find(img => img.is_primary) || images[0];
  const supportingImages = images.filter(img => img.id !== primaryImage.id).slice(0, 4);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-8 group">
        {/* Mobile View: Snapping Horizontal Scroll */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {images.map((img) => (
            <div key={img.id} className="w-full shrink-0 snap-center aspect-[4/3] relative">
              <Image fill src={img.url} alt="Listing image" className="object-cover" />
            </div>
          ))}
        </div>

        {/* Desktop View: Grid Mosaic */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 aspect-[2/1] lg:aspect-[2.5/1]">
          {/* Main Hero Image */}
          <div className="col-span-2 row-span-2 relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowAll(true)}>
            <Image fill src={primaryImage.url} alt="Primary listing view" className="object-cover" />
          </div>
          
          {/* Supporting Images */}
          {supportingImages.map((img, idx) => (
            <div key={img.id} className="col-span-1 row-span-1 relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowAll(true)}>
              <Image fill src={img.url} alt="Listing view" className="object-cover" />
            </div>
          ))}

          {/* Fill empty spots if less than 4 supporting images */}
          {Array.from({ length: 4 - supportingImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="col-span-1 row-span-1 bg-muted/20"></div>
          ))}
        </div>

        {/* Show All Images Button */}
        <button 
          onClick={() => setShowAll(true)}
          className="absolute bottom-4 right-4 md:flex hidden items-center gap-2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold border border-border hover:bg-background transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          Show all photos
        </button>
      </div>

      {/* Lightbox / Full Gallery Modal (Simplified) */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col p-4 overflow-y-auto">
          <button 
            onClick={() => setShowAll(false)}
            className="sticky top-4 left-4 p-2 bg-surface rounded-full shadow-md hover:bg-muted transition-colors w-10 h-10 flex items-center justify-center self-start mb-8 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="max-w-4xl mx-auto w-full space-y-4 pb-20">
            {images.map(img => (
              <div key={img.id} className="relative w-full aspect-video">
                <Image fill src={img.url} alt="Listing gallery image" className="rounded-xl object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

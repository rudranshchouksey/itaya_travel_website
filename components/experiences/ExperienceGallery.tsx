'use client';

import React, { useState } from 'react';
import { type ExperienceImageRead } from '@/lib/api/experiences';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface ExperienceGalleryProps {
  images: ExperienceImageRead[];
}

export function ExperienceGallery({ images }: ExperienceGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[21/9] bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  const primaryImage = images.find(img => img.is_primary) || images[0];

  return (
    <>
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] group bg-black">
        <Image 
          src={primaryImage.url} 
          alt="Experience hero" 
          fill 
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          priority
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 z-10">
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="bg-background/80 backdrop-blur-md border-transparent hover:bg-background text-foreground"
            >
              View gallery ({images.length})
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col p-4 overflow-y-auto">
          <button 
            onClick={() => setShowAll(false)}
            className="sticky top-4 left-4 p-2 bg-surface rounded-full shadow-md hover:bg-muted transition-colors w-10 h-10 flex items-center justify-center self-start mb-8 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          
          <div className="max-w-5xl mx-auto w-full space-y-8 pb-20">
            {images.map(img => (
              <div key={img.id} className="relative w-full aspect-[16/9]">
                <Image fill src={img.url} alt="Experience gallery image" className="rounded-xl object-contain" />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

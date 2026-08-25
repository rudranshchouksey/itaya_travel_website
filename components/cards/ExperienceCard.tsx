import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { type ExperienceSummaryUI } from '@/lib/api/experiences';

export const ExperienceCard = ({ experience }: { experience: ExperienceSummaryUI }) => {
  const imageUrl = experience.thumbnail_url || (experience.images && experience.images.length > 0 ? experience.images[0].url : null);
  
  return (
    <Link href={`/experiences/${experience.slug}`} className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:shadow-md">
      <div className="sm:w-1/3 aspect-[4/3] sm:aspect-auto sm:h-full overflow-hidden bg-muted relative shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted">No Image</div>
        )}
      </div>
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{experience.title}</h3>
            {experience.average_rating && (
              <div className="flex items-center gap-1 text-sm font-medium shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-warning">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                {experience.average_rating}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div className="text-sm text-muted">
            {experience.duration_minutes} minutes
          </div>
          <div className="font-semibold text-foreground">
            From ${experience.base_price}
          </div>
        </div>
      </div>
    </Link>
  );
};

import React from 'react';
import Link from 'next/link';
import { ExperienceSummary } from '@/lib/api/experiences';
import { ExperienceCard } from '@/components/cards/ExperienceCard';

export const ExperiencesSection = ({ experiences }: { experiences: ExperienceSummary[] }) => {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="py-12 md:py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground">Unique Experiences</h2>
          <p className="mt-2 text-muted">Immerse yourself in local culture and adventure</p>
        </div>
        <Link href="/experiences" className="hidden text-sm font-semibold text-primary hover:underline md:block">
          Browse experiences
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {experiences.slice(0, 4).map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
      <div className="mt-8 text-center md:hidden">
        <Link href="/experiences" className="text-sm font-semibold text-primary hover:underline">
          Browse experiences
        </Link>
      </div>
    </div>
  );
};

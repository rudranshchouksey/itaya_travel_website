import React from 'react';
import Link from 'next/link';

export const DesktopNav = () => {
  return (
    <nav className="hidden md:flex gap-6 items-center">
      <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors">Destinations</Link>
      <Link href="/experiences" className="text-sm font-medium hover:text-primary transition-colors">Experiences</Link>
      <Link href="/ai-planner" className="text-sm font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all">✨ AI Planner</Link>
    </nav>
  );
};


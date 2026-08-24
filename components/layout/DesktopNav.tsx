import React from 'react';
import Link from 'next/link';

export const DesktopNav = () => {
  return (
    <nav className="hidden md:flex gap-6">
      <Link href="/destinations" className="text-sm font-medium hover:text-primary transition-colors">Destinations</Link>
      <Link href="/experiences" className="text-sm font-medium hover:text-primary transition-colors">Experiences</Link>
    </nav>
  );
};


import React from 'react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-2 items-center">
          <span className="font-display font-bold text-xl text-primary">Itvaya</span>
        </div>
        <DesktopNav />
        <MobileNav />
      </div>
    </header>
  );
};

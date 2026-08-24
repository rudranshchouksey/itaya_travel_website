import React from 'react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Link href="/" className="font-display font-bold text-2xl text-primary tracking-tight">
            Itvaya
          </Link>
        </div>
        
        <DesktopNav />

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
          </div>
          <Button size="sm" className="hidden md:inline-flex rounded-full">Sign up</Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};


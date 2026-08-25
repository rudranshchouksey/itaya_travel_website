'use client';

import React from 'react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

export const Header = () => {
  const { userId } = useAuth();

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
          {!userId ? (
            <>
              <div className="hidden md:block">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-sm font-medium">Log in</Button>
                </SignInButton>
              </div>
              <SignUpButton mode="modal">
                <Button size="sm" className="hidden md:inline-flex rounded-full">Sign up</Button>
              </SignUpButton>
            </>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link label="Profile" href="/profile" labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} />
                <UserButton.Link label="My Trips" href="/trips" labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>} />
                <UserButton.Link label="Bookings" href="/bookings" labelIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>} />
              </UserButton.MenuItems>
            </UserButton>
          )}

          <MobileNav />
        </div>
      </div>
    </header>
  );
};


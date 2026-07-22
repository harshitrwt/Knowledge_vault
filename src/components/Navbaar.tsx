'use client';

import Link from 'next/link';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Archive, LayoutDashboard, LogIn, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) setShowNav(true);
      else if (currentScrollY > lastScrollY) setShowNav(false);
      else setShowNav(true);
      setLastScrollY(currentScrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed left-1/2 top-4 z-50 flex w-[min(1120px,calc(100vw-32px))] -translate-x-1/2
      items-center justify-between gap-4 rounded-lg border border-[var(--vault-line)]
      bg-white/90 px-3 py-3 text-[var(--vault-ink)] shadow-[var(--vault-shadow-soft)]
      backdrop-blur-xl transition-all duration-300 sm:px-5
      ${showNav ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'}`}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-6">
        <Link href="/" className="flex items-center gap-2 rounded-md px-1 font-extrabold transition hover:text-[var(--vault-brand)]">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--vault-brand)] text-white shadow-sm">
            <Archive className="h-4 w-4" />
          </span>
          <span className="text-lg tracking-normal sm:text-xl">Vault</span>
        </Link>

        <SignedIn>
          <Link
            href="/dashboard"
            className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-[var(--vault-muted)] transition hover:bg-[var(--vault-brand-soft)] hover:text-[var(--vault-brand-dark)] sm:flex"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </SignedIn>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <SignedIn>
          <div className="flex items-center gap-3 rounded-md border border-[var(--vault-line)] bg-[var(--vault-soft)] px-2 py-1.5">
            <span className="hidden items-center gap-1 text-xs font-bold text-[var(--vault-brand)] sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              Ready
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-2">
            <SignInButton>
              <button className="vault-button-secondary min-h-10 px-3 py-2 text-sm sm:px-4">
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="vault-button-primary min-h-10 px-3 py-2 text-sm sm:px-4">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

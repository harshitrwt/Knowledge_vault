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
    <header
      className={`fixed left-1/2 top-5 z-50 flex w-[min(1120px,calc(100vw-32px))] -translate-x-1/2
      items-center justify-between gap-4 p-2 font-display text-[#3D4852]
      transition-all duration-300
      ${showNav ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'}`}
    >
      {/* Left Brand Badge */}
      <Link
        href="/"
        className="neu-extruded-sm flex items-center gap-3 px-4 py-2.5 transition duration-300 hover:scale-[1.02]"
      >
        <span className="neu-inset-sm grid h-9 w-9 place-items-center rounded-xl text-[#6C63FF]">
          <Archive className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-extrabold tracking-tight text-[#3D4852]">
          Vault
        </span>
      </Link>

      {/* Center Navigation Links - Inset Track */}
      <nav className="neu-inset-sm hidden items-center gap-1 px-3 py-1.5 md:flex">
        <a
          href="#features"
          className="rounded-xl px-4 py-2 text-sm font-bold text-[#6B7280] transition-colors hover:text-[#6C63FF]"
        >
          Features
        </a>
        <a
          href="#about"
          className="rounded-xl px-4 py-2 text-sm font-bold text-[#6B7280] transition-colors hover:text-[#6C63FF]"
        >
          About
        </a>
        <a
          href="#howitworks"
          className="rounded-xl px-4 py-2 text-sm font-bold text-[#6B7280] transition-colors hover:text-[#6C63FF]"
        >
          Workflow
        </a>
        <SignedIn>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-[#6C63FF] transition-colors hover:text-[#5851E0]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </SignedIn>
      </nav>

      {/* Right Auth Action Buttons */}
      <div className="flex shrink-0 items-center gap-3">
        <SignedIn>
          <div className="neu-inset-sm flex items-center gap-3 px-3 py-1.5">
            <span className="hidden items-center gap-1 text-xs font-bold text-[#6C63FF] sm:flex">
              <Sparkles className="h-3.5 w-3.5" />
              Active
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="neu-btn-secondary !rounded-full px-5 py-2.5 text-sm">
                <LogIn className="h-4 w-4" />
                Log In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="neu-btn-primary !rounded-full px-5 py-2.5 text-sm">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </header>
  );
}

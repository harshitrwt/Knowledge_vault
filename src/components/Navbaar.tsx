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
      className={`fixed left-1/2 top-8 transform -translate-x-1/2
      bg-[#101222]/80 backdrop-blur-md border border-[#292946]/80
      rounded-2xl shadow-2xl flex items-center justify-between
      w-[90vw] max-w-3xl py-3 px-7 z-50 transition-all duration-400
      ${showNav ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95 pointer-events-none'}`}
      style={{ height: '4.5rem' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-lg font-semibold hover:text-blue-400 transition">
          Home
        </Link>

        {/* Show Dashboard only if signed in */}
        <SignedIn>
          <Link
            href="/dashboard"
            className="text-lg font-semibold hover:text-blue-400 transition"
          >
            Dashboard
          </Link>
        </SignedIn>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Link
              href="/profile"
              className="text-lg hover:text-blue-400 md:inline hidden"
            >
              Profile
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton>
              <button className="bg-[#121224] text-white rounded-full font-medium px-6 py-2 text-base hover:bg-[#070715] transition duration-300 cursor-pointer ">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-[#121224] text-white rounded-full font-medium px-6 py-2 text-base hover:bg-[#070715] transition  duration-300 cursor-pointer ">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

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
      if (currentScrollY < 50) {
        setShowNav(true); 
      } else if (currentScrollY > lastScrollY) {
        setShowNav(false); 
      } else {
        setShowNav(true); 
      }
      setLastScrollY(currentScrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-[-12px] transform bg-black mt-6 border-b border-gray-800 text-white rounded-2xl shadow-lg px-5 py-5 flex items-center justify-between w-full max-w-screen-lg z-50 transition-transform duration-400 ${
        showNav ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-3'
      }`}
      style={{ height: '4.5rem' }}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-semibold hover:text-blue-500">
          Home
        </Link>
        <Link
          href="/dashboard"
          className="text-2xl font-semibold hover:text-blue-500"
        >
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Link href="/profile" className="text-xl hover:text-blue-500">
              Profile
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-5">
            <SignInButton>
              <button className="bg-blue-600 text-white rounded-full font-medium px-7 py-3 text-base hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-blue-600 text-white rounded-full font-medium px-7 py-3 text-base hover:bg-blue-700 transition">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

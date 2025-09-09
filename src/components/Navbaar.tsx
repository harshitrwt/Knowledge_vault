"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-black  mt-6 border-b border-gray-800 text-white rounded-xl shadow-lg px-8 sm:px-20 py-3 flex items-center justify-between w-full max-w-screen-lg z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-semibold hover:text-blue-500">
          Home
        </Link>
        <Link href="/dashboard" className="text-2xl font-semibold hover:text-blue-500">
          Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <SignedIn>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <Link href="/profile" className="text-xl hover:text-blue-500">
              Profile
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton />
            <SignUpButton>
              <button className="bg-blue-600 text-white rounded-full font-medium px-6 py-2 text-sm sm:text-base hover:bg-blue-700 transition">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </div>
    </nav>
  );
}

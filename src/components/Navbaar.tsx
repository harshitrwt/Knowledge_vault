"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-md border border-gray-800 text-2xl rounded-full shadow-lg px-8 sm:px-20 py-3 flex items-center bg-blue-600 gap-8 z-50 min-w-[370px] h-[70px]">
      <Link href="/" className="text-white hover:text-black">
        Home
      </Link>
      <Link href="/dashboard" className="text-white hover:text-black">
        Dashboard
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/profile" className="text-white hover:text-black">
          You
        </Link>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>
    </nav>
  );
}
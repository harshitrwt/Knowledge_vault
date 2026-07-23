"use client";

import Link from "next/link";
import { ArrowRight, Archive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="px-4 pb-12 pt-16 sm:px-6 lg:px-8">
      <div className="neu-extruded mx-auto max-w-7xl rounded-[32px] p-8 sm:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-3 font-display">
              <span className="neu-inset-sm flex h-11 w-11 items-center justify-center rounded-2xl text-[#6C63FF]">
                <Archive className="h-5 w-5" />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-[#3D4852]">Vault</span>
            </Link>
            <h2 className="max-w-xl font-display text-3xl font-extrabold text-[#3D4852] sm:text-4xl">
              A calmer, faster workspace for document intelligence.
            </h2>
            <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-[#6B7280]">
              Upload, analyze, ask, save, and map your files from one coherent product surface.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="neu-btn-primary rounded-2xl px-6 py-3"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/askai"
              className="neu-btn-secondary rounded-2xl px-6 py-3"
            >
              Ask AI
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#A3B1C6]/30 pt-8 font-display text-xs font-bold text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
          <span>Copyright 2026 Smart Vault. All rights reserved.</span>
          <span>Built with Neumorphic Design System.</span>
        </div>
      </div>
    </footer>
  );
}


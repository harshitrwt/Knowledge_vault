"use client";

import Link from "next/link";
import { ArrowRight, Archive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--vault-line)] bg-[var(--vault-ink)] px-4 py-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="mb-5 inline-flex items-center gap-2 font-extrabold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-[var(--vault-brand)]">
              <Archive className="h-5 w-5" />
            </span>
            Vault
          </Link>
          <h2 className="max-w-xl text-3xl font-black leading-tight sm:text-4xl">
            A calmer, faster workspace for document intelligence.
          </h2>
          <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-white/60">
            Upload, analyze, ask, save, and map your files from one coherent product surface.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="vault-button-primary bg-white text-[var(--vault-ink)] hover:bg-[var(--vault-soft)]"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/askai"
            className="vault-button-secondary border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            Ask AI
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs font-bold text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>Copyright 2026 Smart Vault. All rights reserved.</span>
        <span>Built for focused file analysis.</span>
      </div>
    </footer>
  );
}

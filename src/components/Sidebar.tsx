"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, Bot, Home, LayoutDashboard, Map, Menu, Upload, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Uploads", href: "/uploads", icon: Upload },
  { name: "Ask AI", href: "/askai", icon: Bot },
  { name: "MindMap", href: "/mindmap", icon: Map },
  { name: "Home", href: "/", icon: Home },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[var(--vault-line)] bg-white/90 p-4 text-[var(--vault-ink)] shadow-sm backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2 font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--vault-brand)] text-white">
            <Archive className="h-4 w-4" />
          </span>
          Vault
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="vault-icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="fixed left-3 right-3 top-[72px] z-40 flex flex-col gap-1 rounded-lg border border-[var(--vault-line)] bg-white/95 p-2 shadow-[var(--vault-shadow)] backdrop-blur-xl md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md p-3 text-sm font-bold transition-colors ${
                  active
                    ? "bg-[var(--vault-brand)] text-white"
                    : "text-[var(--vault-muted)] hover:bg-[var(--vault-soft)] hover:text-[var(--vault-ink)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}

      <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col border-r border-[var(--vault-line)] bg-white/80 text-[var(--vault-ink)] shadow-sm backdrop-blur-xl md:flex">
        <div className="border-b border-[var(--vault-line)] p-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md bg-[var(--vault-brand)] text-white shadow-sm">
              <Archive className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold leading-tight">Vault</h2>
              <p className="text-xs font-bold text-[var(--vault-muted)]">
                Document command center
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-extrabold transition-all ${
                  active
                    ? "bg-[var(--vault-brand)] text-white shadow-[0_12px_26px_rgba(34,94,75,0.18)]"
                    : "text-[var(--vault-muted)] hover:bg-[var(--vault-soft)] hover:text-[var(--vault-ink)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <div className="rounded-lg border border-[var(--vault-line)] bg-[var(--vault-soft)] p-4">
            <p className="vault-kicker mb-2">Secure Workspace</p>
            <p className="text-sm font-bold text-[var(--vault-ink)]">
              Files, chats, and mind maps stay in one quiet workflow.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

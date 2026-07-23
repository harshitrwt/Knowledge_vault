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
      {/* Mobile Header Bar */}
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[#A3B1C6]/30 bg-[#E0E5EC] p-4 text-[#3D4852] md:hidden">
        <Link href="/" className="flex items-center gap-3 font-display font-extrabold text-lg">
          <span className="neu-inset-sm grid h-9 w-9 place-items-center rounded-xl text-[#6C63FF]">
            <Archive className="h-5 w-5" />
          </span>
          Vault
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="neu-icon-btn h-10 w-10 rounded-xl"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <nav className="neu-extruded fixed left-4 right-4 top-20 z-40 flex flex-col gap-2 rounded-3xl p-4 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3.5 rounded-2xl px-4 py-3.5 font-display text-sm font-bold transition-all ${
                  active
                    ? "neu-inset text-[#6C63FF]"
                    : "text-[#6B7280] hover:text-[#3D4852]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col bg-[#E0E5EC] p-6 text-[#3D4852] md:flex">
        {/* Brand Container */}
        <div className="neu-extruded-sm mb-8 rounded-2xl p-4">
          <Link href="/" className="flex items-center gap-3.5 font-display">
            <span className="neu-inset-sm flex h-11 w-11 items-center justify-center rounded-2xl text-[#6C63FF]">
              <Archive className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold leading-tight text-[#3D4852]">Vault</h2>
              <p className="text-xs font-medium text-[#6B7280]">
                Workspace Center
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items Inset Track */}
        <nav className="neu-inset-deep flex flex-col gap-2.5 rounded-3xl p-3.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 font-display text-sm font-bold transition-all ${
                  active
                    ? "neu-btn-primary shadow-sm"
                    : "text-[#6B7280] hover:text-[#6C63FF] hover:bg-[#E0E5EC]/50"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info box */}
        <div className="mt-auto pt-6">
          <div className="neu-inset-sm rounded-2xl p-4 text-center">
            <p className="font-display text-xs font-extrabold uppercase text-[#6C63FF] mb-1">
              Protected Surface
            </p>
            <p className="text-xs font-medium text-[#6B7280]">
              Files & AI conversations secured in workspace.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

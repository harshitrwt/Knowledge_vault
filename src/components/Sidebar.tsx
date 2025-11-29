"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, User, Menu, Bot, Map} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Uploads", href: "/uploads", icon: Upload },
  { name: "Ask AI", href: "/askai", icon: Bot },
  { name: "MindMap", href: "/mindmap", icon: Map },
  { name: "Home", href: "/", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white flex items-center justify-between p-4 border-b border-gray-800 md:hidden">
        <h2 className="text-2xl font-bold">VAULT</h2>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded hover:bg-gray-800"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <nav className="fixed top-14 left-0 right-0 z-40 bg-black border-b border-gray-800 md:hidden flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-4 text-lg transition-colors ${
                  active ? "bg-blue-800" : "hover:bg-blue-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col min-h-screen w-64 bg-black text-white border-r border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-3xl font-bold">VAULT</h2>
        </div>

        <nav className="flex flex-col space-y-1 mt-4 mx-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 text-xl rounded-lg transition-colors ${
                  active ? "bg-blue-800" : "hover:bg-blue-900"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

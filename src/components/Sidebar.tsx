"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, User, Menu, Bot } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Uploads", href: "/uploads", icon: Upload },
  { name: "Ask AI", href: "/askai", icon: Bot },
  { name: "Home", href: "/", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-black text-white flex flex-col transition-all duration-300 border-r border-gray-800
        ${collapsed ? "w-25" : "w-64"}
      `}
    >
     
      <div className="flex items-center justify-between p-4">
        {!collapsed && <h2 className="text-3xl md:m-4 font-bold">VAULT</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-800"
        >
          <Menu className="w-5 h-5 md:h-8 md:w-8" />
        </button>
      </div>

      
      <nav className="flex flex-col space-y-1 mt-4 mx-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 md:text-xl rounded-lg transition-colors
                ${active ? "bg-blue-800" : "hover:bg-blue-900"}
              `}
            >
              <Icon className="w-5 h-5 md:h-8 md:w-8" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

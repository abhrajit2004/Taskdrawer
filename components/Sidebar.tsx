"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, Folder, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: ListChecks },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 text-lg font-semibold tracking-wide text-gray-900 dark:text-white">
        Task Manager
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link key={name} href={href}>
            <div
              className={cn(
                "flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition",
                pathname === href && "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {name}
            </div>
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">v1.0.0</p>
      </div>
    </aside>
  );
}

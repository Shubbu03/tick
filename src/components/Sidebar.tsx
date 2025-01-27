"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, CreditCard, BarChart2, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen bg-white dark:bg-teal-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 relative`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-teal-900 border border-gray-200 dark:border-gray-800 rounded-full p-1.5 text-gray-600 dark:text-gray-400"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className={`text-2xl font-bold text-teal-600 dark:text-teal-400 ${isCollapsed ? 'hidden' : 'block'}`}>
            Tick
          </span>
        </Link>
      </div>

      <nav className={`flex flex-col ${isCollapsed ? 'px-2' : 'px-4'} mt-6`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'px-2'} py-3 text-sm ${
                isActive
                  ? "text-teal-600 dark:text-teal-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-full bg-teal-600 dark:bg-teal-400"
                />
              )}
              <item.icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
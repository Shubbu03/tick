"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  BarChart2,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-screen bg-gradient-to-b from-teal-500 to-cyan-600 dark:from-teal-950 dark:to-cyan-900 border-r border-white/10 transition-all duration-300 ease-in-out fixed`}
    >
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-1.5 text-white transition-transform duration-300 ease-in-out hover:bg-white/20"
        animate={{ rotate: isCollapsed ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <ChevronRight size={16} />
      </motion.button>

      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <motion.span
            className={`text-2xl font-bold text-white origin-left`}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              scale: isCollapsed ? 0 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            Tick
          </motion.span>
        </Link>
      </div>

      <nav
        className={`flex flex-col ${
          isCollapsed ? "px-2" : "px-4"
        } mt-6 transition-all duration-300 ease-in-out`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center ${
                isCollapsed ? "justify-center" : "px-2"
              } py-3 text-sm ${
                isActive
                  ? "text-white bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              } rounded-lg transition-all duration-300 ease-in-out group`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-full bg-white rounded-r"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              )}
              <div className="flex items-center">
                <Icon className="w-5 h-5 transition-transform duration-300 ease-in-out" />
                {!isCollapsed && (
                  <motion.span
                    className="ml-3 origin-left"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

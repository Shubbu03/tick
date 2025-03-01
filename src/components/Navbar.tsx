"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  CreditCard,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center p-3 sm:p-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
            Hi, {session?.user?.username || ""}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">
            Here&apos;s your subscription overview
          </p>
        </div>

        <div className="hidden sm:flex items-center space-x-4">
          <ThemeToggle />
          <button
            className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="flex sm:hidden items-center">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 py-2 px-3">
          <div className="space-y-2 mb-4">
            {navItems.map((item) => {
              const isItemActive = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                    isItemActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                  {isItemActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Theme
              </div>
              <ThemeToggle />
            </div>
            <button
              className="w-full flex items-center justify-between p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
            >
              <span>Logout</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

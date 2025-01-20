"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className="bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-gray-900 dark:to-gray-700 p-4 md:p-6 shadow-md"
      aria-label="Main Navigation"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white mb-4 md:mb-0">
          Tick
        </Link>

        <div className="flex space-x-4 order-first md:order-none mb-4 md:mb-0">
          <Link
            href="/"
            className={`text-white hover:text-white/80 transition-colors ${
              isActive("/") ? "font-bold" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-white hover:text-white/80 transition-colors ${
              isActive("/about") ? "font-bold" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`text-white hover:text-white/80 transition-colors ${
              isActive("/contact") ? "font-bold" : ""
            }`}
          >
            Contact
          </Link>
        </div>

        {isMounted ? (
          session ? (
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <span className="text-white">
                Welcome, {user?.username || user?.email}
              </span>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button
                  onClick={() => signOut()}
                  variant="secondary"
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex justify-center">
              <Button
                variant="secondary"
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
              >
                Login
              </Button>
            </Link>
          )
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

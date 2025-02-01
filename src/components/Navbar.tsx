"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
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
    <div className="flex justify-between items-center p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Hi, {session?.user?.username || ""}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here`s your subscription overview
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button
          className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

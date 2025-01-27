"use client";

import { LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 pl-16">
        <div className="flex justify-end items-center p-4 space-x-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <ThemeToggle />
          <button
            className="flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

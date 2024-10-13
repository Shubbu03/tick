"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Theme } from "./Theme";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-gradient-to-r from-purple-400 to-indigo-600 dark:from-gray-900 dark:to-gray-700 p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white mb-4 md:mb-0">
          Tick
        </Link>
        {session ? (
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <span className="text-white">
              Welcome, {user?.username || user?.email}
            </span>
            <div className="flex items-center space-x-4">
              <Theme />
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
          <Link href="/login">
            <Button
              variant="secondary"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

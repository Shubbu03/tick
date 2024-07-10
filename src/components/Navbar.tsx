"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { Theme } from "./Theme";

const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md  bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Tick
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome , {user?.username || user?.email}
            </span>
            <div className="flex items-center space-x-4">
              <Theme />
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Link href="/login">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
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

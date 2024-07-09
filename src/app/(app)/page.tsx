"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react"; // Assuming you have an icon for messages


export default function Home(){
    return(
        <>
        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white min-h-screen ">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            All your subscriptions managed.Hassle Free.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
          Tick - A streamlined subscription manager to effortlessly track and manage all your subscriptions.
          </p>
        </section>
        </main>

        <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2024 Tick. All rights reserved.
      </footer>
        </>
    )

} 
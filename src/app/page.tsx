"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import AnimatedBackground from "@/app/(landing)/components/AnimatedBackground";
import Hero from "@/app/(landing)/components/Hero";
import Features from "@/app/(landing)/components/Features";
import Footer from "@/app/(landing)/components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 relative overflow-hidden"></div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-700 dark:from-teal-950 dark:via-cyan-900 dark:to-blue-950 relative overflow-hidden">
        <AnimatedBackground />

        <header className="absolute top-4 right-4 z-20"></header>

        <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white relative z-10">
          <Hero />
          <Features />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}

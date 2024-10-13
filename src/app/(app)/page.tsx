"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 dark:from-gray-900 dark:to-gray-700">
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-white">
        <section className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            All your subscriptions managed. Hassle Free.
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Tick - A streamlined subscription manager to effortlessly track and
            manage all your subscriptions.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-indigo-600 hover:bg-white/90"
          >
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            "Track all subscriptions in one place",
            "Get reminders before renewals",
            "Analyze your spending habits",
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center bg-white/10 backdrop-blur-md rounded-lg p-4"
            >
              <CheckCircle className="h-6 w-6 mr-3 text-green-400" />
              <p className="text-lg">{feature}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="text-center p-4 md:p-6 bg-white/10 backdrop-blur-md text-white">
        <p>© 2024 Tick. All rights reserved.</p>
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
          >
            Privacy Policy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/20"
          >
            Terms of Service
          </Button>
        </div>
      </footer>
    </div>
  );
}

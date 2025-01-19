"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 max-w-3xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-200 dark:from-teal-200 dark:to-white">
          Simplify Your Subscriptions with Tick
        </h1>
      </motion.div>
      <p className="text-xl md:text-2xl mb-8 text-teal-100 dark:text-teal-200">
        Effortlessly track, manage, and optimize all your subscriptions in one
        place.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/signup" className="flex items-center">
            Start Saving Today
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </Link>
        </Button>
      </motion.div>
    </motion.section>
  );
}

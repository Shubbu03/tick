"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="text-center p-4 md:p-6 bg-gradient-to-r from-white/5 to-white/10 dark:from-black/5 dark:to-black/10 backdrop-blur-lg text-white dark:text-teal-100 border-t border-white/10 dark:border-teal-900/30">
      <p>© {new Date().getFullYear()} Tick. All rights reserved.</p>
      <div className="mt-2">
        <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-100 hover:text-white dark:text-teal-200 dark:hover:text-white hover:bg-white/20"
          >
            Privacy Policy
          </Button>
        </motion.div>
        <motion.div className="inline-block" whileHover={{ scale: 1.05 }}>
          <Button
            variant="ghost"
            size="sm"
            className="text-teal-100 hover:text-white dark:text-teal-200 dark:hover:text-white hover:bg-white/20"
          >
            Terms of Service
          </Button>
        </motion.div>
      </div>
    </footer>
  );
}
